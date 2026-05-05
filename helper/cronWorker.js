/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import moment from "moment";
import { parentPort, threadId, workerData } from "worker_threads";
import cronLogger from "../config/cron-logger.js";
import Event from "../models/Event.js";
import Login from "../models/Login.js";
import User from "../models/User.js";
import EventCounts from "../models/eventsCount.js";
import FormData from "../models/formDataModel.js";
import { preprocessEvents } from "./eventsUtils.js";
import sendEmails from "./sendEmail.js";
import {
  getLastProcessedDate,
  isUserActive,
  sendDataToPython,
  updateUserEventStatus,
} from "./utils.js";

export async function runCronJob(userId, response) {
    try {
        if (!(await isUserActive(userId))) {
            //   parentPort.postMessage({
            //     status: 'skipped',
            //     message: `User ${userId} is inactive.`,
            //   });
            return;
        }

        if (!response.Data?.Calendar) {
            //   parentPort.postMessage({
            //     status: 'skipped',
            //     message: `No calendar data for user ${userId}.`,
            //   });
            return;
        }

        const lastProcessedDate = await getLastProcessedDate(userId);
        cronLogger.info(`User ${userId} last processed date: ${lastProcessedDate}`);

        const lastProcessedMoment = moment(lastProcessedDate);
        const filteredDates = Object.entries(response.Data.Calendar)
            .filter(([date]) =>
                lastProcessedDate ? moment(date).isAfter(lastProcessedMoment) : true,
            )
            .sort(([dateA], [dateB]) => moment(dateA).diff(moment(dateB)));

        if (filteredDates.length === 0) {
            //   parentPort.postMessage({
            //     status: 'completed',
            //     message: `User ${userId} has no new events to process.`,
            //   });
            return;
        }

        await FormData.update({ status: "processing" }, { where: { user_id: userId } });

        for (const [date, details] of filteredDates) {
            try {
                const stillProcessing = await FormData.findOne({
                    where: { user_id: userId, Datastatus: "1" },
                    raw: true,
                });

                console.log(
                    `[Thread ${threadId}] Starting processing for User ${
                        workerData.userId
                    } at ${new Date().toISOString()}`,
                );

                parentPort.on("message", (msg) => {
                    console.log(`[Thread ${threadId}] Message from main thread: ${msg}`);
                });

                if (stillProcessing) {
                    //   parentPort.postMessage({
                    //     status: 'skipped',
                    //     message: `User ${userId} is already processing.`,
                    //   });
                    return;
                }

                await FormData.update({ Datastatus: "1" }, { where: { user_id: userId } });

                const lastDate = filteredDates.at(-1)?.[0];

                const firstDate = filteredDates[0][0];

                let remainingDays = 365;

                const dayDataPython = { [date]: details };

                remainingDays =
                    365 - Math.floor((new Date(lastDate) - new Date(date)) / (1000 * 60 * 60 * 24));

                const pendingDays = Math.max(
                    365 -
                        Math.floor((new Date(date) - new Date(firstDate)) / (1000 * 60 * 60 * 24)),
                    0,
                );

                console.log(`Processing date: ${date}, Pending Days: ${pendingDays}`);
                console.log(`Processing date: ${date}, Completed Days: ${remainingDays}`);
                cronLogger.info(
                    `Processing date: ${date} for user ${userId}, Completed Days: ${remainingDays}`,
                );
                cronLogger.info(
                    `Processing date: ${date} for user ${userId}, Pending Days: ${pendingDays}`,
                );

                const fetchDistributionData = await FormData.findOne({
                    where: { user_id: userId },
                    raw: true,
                    attributes: ["distribution_data"],
                });

                const priorityLevels = response.Data.Priority_Level;
                const distributionData =
                    fetchDistributionData?.distribution_data || response?.Data?.distribution_data;

                let result;
                try {
                    result = await sendDataToPython(
                        JSON.stringify(dayDataPython),
                        JSON.stringify(priorityLevels),
                        JSON.stringify(distributionData),
                    );

                    if (result.toLowerCase().includes("fail")) {
                        console.log(`Skipping date: ${date} due to failure.`);
                        cronLogger.error(
                            `Skipping date ${date} for user ${userId} due to processing failure.`,
                        );
                        continue;
                    }

                    result = JSON.parse(result);
                } catch (error) {
                    console.log("Error processing date:", date, error);
                    cronLogger.error(
                        `Error processing date ${date} for user ${userId}: ${error.message}`,
                    );
                    continue;
                }

                const extractedCalendar = result?.Calendar?.Calendar || result?.Calendar;
                const eventData = await preprocessEvents(extractedCalendar, userId);

                if (Array.isArray(eventData) && eventData.length) {
                    await Event.bulkCreate(eventData);
                }

                const existingCount = await Event.count({ where: { user_id: userId } });

                if (!existingCount) {
                    await EventCounts.create({
                        user_id: userId,
                        count: remainingDays,
                    });
                } else {
                    await EventCounts.update(
                        { count: remainingDays },
                        { where: { user_id: userId } },
                    );
                }

                cronLogger.info(
                    `User ${userId} completed processing events for date ${date}. Total Events: ${eventData.length}`,
                );
                await FormData.update(
                    { Datastatus: "0", distribution_data: result?.distribution_data },
                    { where: { user_id: userId } },
                );
            } catch (error) {
                console.log("error", error);
                cronLogger.error(
                    `Error processing date ${date} for user ${userId}: ${error.message}`,
                );
            }
        }
        // After processing all 365 days, update eventStatus to inactive
        await EventCounts.update(
            { count: 0, eventStatus: "active" },
            { where: { user_id: userId } },
        );

        await updateUserEventStatus(userId, "active");

        await FormData.update(
            { status: "completed", distribution_data: null },
            { where: { user_id: userId } },
        );

        const user = await User.findOne({ where: { id: userId }, raw: true });

        const login = await Login.findOne({
            where: { user_id: userId },
            attributes: ["email"],
            raw: true,
        });

        const mailOptions = {
            from: "midhun@spericorn.com",
            to: login.email,
            subject: "Your Calendar Optimization is Complete! 🎉",
        };

        sendEmails({
            mailOptions,
            fileName: "calenderGenerated.ejs",
            contentVarialbles: {
                name: `${user.first_name} ${user.second_name}`,
                feUrl: `${process.env.WEB_DOMAIN}/calendar`,
            },
        });

        // parentPort.postMessage({
        //   status: 'completed',
        //   message: `User ${userId} processed successfully.`,
        // });
    } catch (error) {
        // parentPort.postMessage({ status: 'error', message: error.message });
        console.log("error", error);
    }
}

export async function runWorker() {
    if (workerData) {
        const { userId, response } = workerData;

        try {
            await runCronJob(userId, response);
            // parentPort.postMessage({
            //   status: 'completed',
            //   message: `User ${userId} processed successfully.`,
            // });
        } catch (error) {
            // parentPort.postMessage({ status: 'error', message: error.message });
            console.log("error", error);
        }
    }
}

// Make sure the worker script runs
runWorker();
