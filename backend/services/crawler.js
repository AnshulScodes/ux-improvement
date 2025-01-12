const { chromium } = require('playwright');

async function crawlWebsite(url) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const data = {
        title: '',
        links: [],
        buttons: [],
        forms: []
    };

    try {
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Get page title
        data.title = await page.title();

        // Get all links
        data.links = await page.$$eval('a', links => links.map(link => ({
            text: link.innerText,
            href: link.href
        })));

        // Get all buttons
        data.buttons = await page.$$eval('button', buttons => buttons.map(button => ({
            text: button.innerText
        })));

        // Get all forms
        data.forms = await page.$$eval('form', forms => forms.map(form => ({
            inputs: form.querySelectorAll('input').length
        })));

        await browser.close();
        return data;

    } catch (error) {
        await browser.close();
        throw error;
    }
}

module.exports = { crawlWebsite }; 