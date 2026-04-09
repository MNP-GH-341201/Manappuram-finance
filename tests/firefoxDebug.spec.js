const {test} =require('@playwright/test');
const{firefox} =require('@playwright/test');
test('Test on Firefox',async()=>{
    const browser =await firefox.connectOverCDP('http://localhost:6000');
    const context =await browser.newContext();
    const page =await context.newPage();
    await page.goto('https://example.com');
    console.log(await page.title());
    await browser.close();
});