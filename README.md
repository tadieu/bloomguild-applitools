
# Purpose

This project is an example CI Package created with [Serverless](https://serverless.com/), [AWS Lambda](https://aws.amazon.com/lambda/), [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome), [Node](https://nodejs.org/en/), and [Applitools](https://applitools.com/).

The main purpose of this integration is to showcase the potential value of leveraging these technologies for an immediate assertion of functionality for a development, staging or production software environment.

# Code Organization

The code here is organized according to best practices with personas, pages and scenario folders. Scenarios will direct the browser to a particular state, but have no knowledge of the page implementation. All page selectors are defined in the associated page file, so if changes are made, they can be updated easily in one place, rather than across hundreds of test files. Personas contain test user information.

# Setup

## Clone This Repo

``` git clone git@github.com:tadieu/bloomguild-applitools-sunbasket.git```

## Configure AWS Lambda Serverless

Note: For all aws service configuration, we recommend using us-east-1.

Review and execute these [steps](https://serverless.com/framework/docs/providers/aws/guide/credentials/) for serverless configuration.

Configure, build and deploy serverless service for running and interacting with chrome remotely with chromeless by following these steps (replacing the serverless directory location to be the one relative to this project, eg bloomguild-applitools-sunbasket/serverless): 
https://github.com/adieuadieu/chromeless/tree/master/serverless#installation

## Set Local Variables

Set these enviornment variables, for example in a file called ~/.bash_profile_bloomguild:

```
# for application under test

export AUT_DOMAIN=TO SET, something like https://target-domain.com
export APP_UNDER_TEST=TO SET, something like SunBasket
export BRANCH=master

# for aws:

export AWS_IOT_HOST=TO SET.iot.us-east-1.amazonaws.com
export AWS_ACCESS_KEY_ID=TO SET
export AWS_SECRET_ACCESS_KEY=TO SET
export CHROMELESS_ENDPOINT_URL=https://TO SET.execute-api.us-east-1.amazona\
ws.com/dev/
export CHROMELESS_ENDPOINT_API_KEY=NEED_TO_SET
export S3_BUCKET_NAME=TO SET-us-east-1-chromeless

for applitools:

export APPLITOOLS_API_KEY=TO SET
```

# Usage

To run:

``` node scenarios/run_all_scenarios.js ```

To review test results go to [https://eyes.applitools.com](https://eyes.applitools.com) 


# Future Changes

- Build out an extensive set of scenarios.
- Update the chrome screenshot functionality to take the full screenshot (rather than just the visible section). This may be possible with the recent versions of chrome from version 59: https://www.youtube.com/watch?v=4mx1m7UbBR0
- Replace headless chrome control currently done with chromeless (https://github.com/graphcool/chromeless) with the latest official Chrome library called Puppeteer: https://github.com/GoogleChrome/puppeteer
- Replace logic to download the image file from s3 with applitools images sdk which will transfer the bitfile in memory. More details in scenarios/process_images.js.