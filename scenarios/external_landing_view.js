const { Chromeless } = require('chromeless')

async function run() {
    const chromeless = new Chromeless({
        remote: true,
    })

    const screenshot = await chromeless
        .goto(process.env.AUT_DOMAIN)
        .screenshot()

    console.log(screenshot) // prints local file path or S3 url

    await chromeless.end()

    var process_image = require('./process_image.js');
    await process_image.process_file(screenshot, 'external_landing_view'); 

}

run().catch(console.error.bind(console));

module.exports = {
    run: run
}