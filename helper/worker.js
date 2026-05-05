import { parentPort, workerData } from "worker_threads";
import runCronJob from "./eventCreationCron.js";

(async () => {
    try {
        await runCronJob(workerData.userId, workerData.formData);
        parentPort.postMessage(`User ${workerData.userId} processing complete`);
    } catch (error) {
        parentPort.postMessage(`Error processing user ${workerData.userId}: ${error.message}`);
    }
})();
