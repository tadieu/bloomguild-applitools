const { Chromeless } = require('chromeless')
const { buildUrl } = require('build-url')

async function run() {
    const chromeless = new Chromeless({
        remote: true,
    })

    var login_page = require('./../pages/login_page.js');

    const screenshot = await chromeless
        .goto(buildUrl(process.env.SUNBASKET_DOMAIN, {
            path: login_page.path
            }
            ))   
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