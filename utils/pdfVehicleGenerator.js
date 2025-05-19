const puppeteer = require("puppeteer");
const getHtmlTemplate = require("../templates/carTemplate");

async function generateCarPdf(car) {
  const html = getHtmlTemplate(car);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "1in",
      right: "1in",
      bottom: "1in",
      left: "1in",
    },
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = generateCarPdf;
