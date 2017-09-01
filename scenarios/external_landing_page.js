const { Chromeless } = require('chromeless')

async function run() {
    const chromeless = new Chromeless({
        remote: true,
    })

    const screenshot = await chromeless
        .goto('https://sunbasket.com')
        .screenshot()

    console.log(screenshot) // prints local file path or S3 url

    await chromeless.end()

    var process_image = require('./process_image.js');
    await process_image.process_file(screenshot); 

}

run().catch(console.error.bind(console));