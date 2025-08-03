import express from "express";
const router = express.Router();
import { chromium } from 'playwright';

router.post("/generate", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: "HTML content is required." });
    }

    const browser = await chromium.launch();
    if (!browser) {
      return res.status(400).json({ error: "Unable to launch browser" });
    }
    const page = await browser.newPage();
    const contentHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Resume PDF</title>
          <style>
            /* Inline Tailwind (or custom CSS) here if needed */
            body {
              font-family: sans-serif;
            }
          </style>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body>
          ${html}  <!-- This is your rendered resume HTML -->
        </body>
      </html>
    `;

    await page.setContent(contentHTML, { waitUntil: "networkidle" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.log("error occured while generating pdf ", error);
    return res.status(500).json({ error: "Server Error Occured" });
  }
});

export default router;