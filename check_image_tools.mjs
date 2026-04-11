import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:9002/categories/image-tools');
  
  try {
    // Wait for the tool cards to load
    await page.waitForSelector('h3', { timeout: 5000 });
    
    // Extract all the tools on the page
    const tools = await page.$$eval('h3', elements => elements.map(el => el.textContent));
    
    console.log('Tools found on the page:');
    tools.forEach((t, i) => console.log(`${i + 1}. ${t}`));
    
    if (tools.includes('Add White Background')) {
      console.log('\\n✅ VERIFIED: "Add White Background" is present in the list!');
    } else {
      console.log('\\n❌ FAILED: "Add White Background" is NOT in the list.');
    }
  } catch (error) {
    console.log('Error occurred while checking the page:', error.message);
  }
  
  await browser.close();
})();
