const { Chromeless } = require('chromeless')

async function run() {
    const chromeless = new Chromeless({
        remote: true,
    })

    const screenshot = await chromeless
        .goto('https://www.google.com')
        .type('chromeless', 'input[name="q"]')
        .press(13)
        .wait('#resultStats')
        .screenshot()

    console.log(screenshot) // prints local file path or S3 url

    await chromeless.end()

    var s3 = require('s3');
    const { URL } = require('url');
    const myURL = new URL(screenshot);

    var client = s3.createClient({
        maxAsyncS3: 20,     // this is the default 
        s3RetryCount: 3,    // this is the default 
        s3RetryDelay: 1000, // this is the default 
        multipartUploadThreshold: 20971520, // this is the default (20 MB) 
        multipartUploadSize: 15728640, // this is the default (15 MB) 
        s3Options: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    const key_name = myURL.pathname.substr(1)
    // download the image file
    var params = {
        localFile: 'images/' + key_name,

        s3Params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key_name,
        },
    };
    console.log('Key is: ', key_name);
    var downloader = client.downloadFile(params);
    downloader.on('error', function (err) {
        console.error("unable to download:", err.stack);
    });
    downloader.on('progress', function () {
        console.log("progress", downloader.progressAmount, downloader.progressTotal);
    });
    downloader.on('end', function () {
        console.log("done downloading");
    });

    // send the image file to applitools via the ImageTester jar
    var exec = require('child_process').exec;
    var child = exec('java -jar ImageTester.jar -k ' + process.env.APPLITOOLS_API_KEY + ' -f images/' + key_name,
        function (error, stdout, stderr) {
            console.log('Output -> ' + stdout);
            if (error !== null) {
                console.log("Error -> " + error);
            }
        });
    module.exports = child;

    /* TODO: Add proper blocking logic here
    // delete the image from local disk
    var fs = require('fs');
    var filePath = './images/' + key_name;
    fs.unlink(filePath, function (err) {
        if (err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info(`removed`);
        }
    });
    */

}

run().catch(console.error.bind(console))








