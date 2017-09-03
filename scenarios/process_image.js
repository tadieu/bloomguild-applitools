
async function get_keyname(screenshot){
    const { URL } = require('url');
    const myURL = new URL(screenshot);
    const key_name = myURL.pathname.substr(1);
    return key_name;
}

async function process_file(screenshot, view_name) {
    var s3 = require('s3');

    var client = await s3.createClient({
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

    const key_name = await get_keyname(screenshot);
    // download the image file
    var params = {
        localFile: 'images/' + view_name +'.png',

        s3Params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key_name,
        },
    };
    console.log('key is: ', key_name);
    console.log('view_name is: ', view_name);
    var downloader = await client.downloadFile(params);
    await downloader.on('error', function (err) {
        console.error("unable to download:", err.stack);
    });
    await downloader.on('progress', function () {
        console.log("progress", downloader.progressAmount, downloader.progressTotal);
    });
    await downloader.on('end', function () {
        console.log("done downloading");
        send_to_applitools(view_name);
    });
}


async function send_to_applitools(view_name) {
    // send the image file to applitools via the ImageTester jar
    var exec = require('child_process').exec;
    var child = await exec('java -jar ImageTester.jar ' +  
                            ' -a ' + process.env.APP_UNDER_TEST +
                            ' -ap ' + process.env.AUT_DOMAIN +
                            ' -bn ' + view_name +
                            ' -br ' + process.env.BRANCH +
                            ' -f images/' + view_name + '.png' +
                            ' -k ' + 
                            process.env.APPLITOOLS_API_KEY +
                            ' -os awsLambda',
        function (error, stdout, stderr) {
            console.log('Output -> ' + stdout);
            if (error !== null) {
                console.log("Error -> " + error);
            }
            delete_local_image(view_name);
        });
    module.exports = child;
}

async function delete_local_image(view_name) {
    // delete the image from local disk
    var fs = require('fs');
    var filePath = './images/' + view_name + '.png';
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
}

module.exports = {
    process_file: process_file
}








