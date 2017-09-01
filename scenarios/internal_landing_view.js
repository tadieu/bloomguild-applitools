const { Chromeless } = require('chromeless')
const { buildUrl } = require('build-url')

async function run() {
    const chromeless = new Chromeless({
        remote: true,
    })

    var login_page = require('./../pages/login_page.js');
    var persona_a = require('./../personas/persona_a.js');

    const screenshot = await chromeless
        .goto(buildUrl(process.env.SUNBASKET_DOMAIN, {
            path: login_page.path
            }
            ))   
        .type(persona_a.email, login_page.email_input_selector)
        .type(persona_a.password, login_page.password_input_selector)
        .click(login_page.submit_button_selector)
        .wait('#settings-dropdown')
        .screenshot()

    console.log(screenshot) // prints local file path or S3 url

    await chromeless.end()

    var process_image = require('./process_image.js');
    await process_image.process_file(screenshot); 

}

run().catch(console.error.bind(console));

module.exports = {
    run: run
}