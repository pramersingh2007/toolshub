import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:9002/categories/image-tools');
  
  try {
    await page.waitForSelector('text="Add White Background"', { timeout: 5000 });
    console.log('SUCCESS: "Add White Background" tool is VISIBLE on the image-tools category page.');
  } catch (error) {
    console.log('FAILURE: "Add White Background" tool is NOT FOUND on the page.');
  }
  
  await browser.close();
})();
