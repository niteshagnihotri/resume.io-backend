require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { chromium } = require("playwright");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
// Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("DB Connection failed ", error));

// Routes
app.use("/api/auth", require("./routes/auth"));

app.post("/api/generate-pdf", async (req, res) => {
  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: "HTML content is required." });
  }

  const browser = await chromium.launch();
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
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
