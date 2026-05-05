/* eslint-disable import/no-extraneous-dependencies */
import ejs from "ejs";
import fs, { readFileSync } from "fs";
import imageToBase64 from "image-to-base64";
import path, { dirname, join } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const getBase64FromImageUrl = async (url) => {
    const base64Image = await imageToBase64(url);

    // Check if it's an SVG image and encode it accordingly
    if (url.endsWith(".svg")) {
        return base64Image.startsWith("data:image/svg+xml;base64,")
            ? base64Image
            : `data:image/svg+xml;base64,${base64Image}`;
    }
    // Handle PNG and other image formats (as per your original code)
    return base64Image.startsWith("data:image/png;base64,")
        ? base64Image
        : `data:image/png;base64,${base64Image}`;
};

export const generatePDF = async (data, htmlFilePath) => {
    const browser = await puppeteer.launch({
        headless: true, // Set to true or false based on your needs
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-profile",
            "--aggressive-cache-discard",
            "--disable-cache",
            "--media-cache-size=0",
            "--disk-cache-size=0",
            "--aggressive-cache-discard",
            "--disable-application-cache",
            "--disable-offline-load-stale-cache",
            "--disable-gpu-shader-disk-cache",
        ],
        timeout: 6000000,
    });

    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(6000000);
    await page.setDefaultTimeout(6000000);

    const htmlTemplate = readFileSync(htmlFilePath, "utf-8");

    const base64Images = await Promise.all(data.imageUrls.map((url) => getBase64FromImageUrl(url)));

    data = { ...data, base64Images };

    const renderedHTML = ejs.render(htmlTemplate, {
        data,
    });

    // ejs.renderFile(htmlFilePath, { data }, (err, html) => {
    //   if (err) {
    //     console.error('Error rendering EJS:', err);
    //     return;
    //   }

    //   // Write the generated HTML to a file
    //   fs.writeFileSync('output.html', html);
    //   console.log('HTML file generated successfully!');
    // });

    await page.setContent(renderedHTML, {
        waitUntil: "domcontentloaded",
        timeout: 6000000,
    });

    const pdfBuffer = await page.pdf({
        timeout: 6000000, // Set a high timeout
    }); // Generate PDF

    await browser.close();

    return pdfBuffer;
};

export const deletePdfs = () => {
    const currentModuleDirectory = dirname(fileURLToPath(import.meta.url));

    const folderPath = join(currentModuleDirectory, "..", "public", "calendarPDF");

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }
        files.forEach((file) => {
            const filePath = path.join(folderPath, file);

            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error deleting file ${file}:`, unlinkErr);
                } else {
                    console.log(`Successfully deleted file: ${file}`);
                }
            });
        });
    });
};
