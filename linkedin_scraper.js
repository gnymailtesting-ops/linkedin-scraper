import puppeteer from "puppeteer";
import fetch from "node-fetch";

// === CONFIGURE THESE ===
const WEBHOOK_URL =
  "https://alpha-coders.app.n8n.cloud/webhook-test/send-details"; // from Step 1
const LINKEDIN_EMAIL = "gnymailtesting@gmail.com";
const LINKEDIN_PASS = "Harsh#54";
const JOBS_URL =
  "https://www.linkedin.com/jobs/search/?keywords=frontend%20developer";

// =========================
async function scrapeLinkedIn() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Opening LinkedIn login...");
  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "networkidle2",
  });

  console.log("Logging in...");
  await page.type("#username", LINKEDIN_EMAIL);
  await page.type("#password", LINKEDIN_PASS);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  console.log("Login successful. Navigating to jobs page...");
  await page.goto(JOBS_URL, { waitUntil: "networkidle2" });

  // Get full HTML
  const html = await page.content();

  console.log("Sending data to n8n Webhook...");
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: html }),
  });

  console.log("✅ Done! Data sent to n8n.");
  await browser.close();
}

scrapeLinkedIn().catch(console.error);
