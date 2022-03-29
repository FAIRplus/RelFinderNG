var jasmineReporters = require('jasmine-reporters');

// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
// https://www.npmjs.com/package/protractor-html-reporter-2

var reportsDirectory = './e2e/reports/';
var dashboardReportDirectory = reportsDirectory + '/dashboardReport/';
var imagesDir = dashboardReportDirectory + '/images/';

/**
 * @type { import("protractor").Config }
 */
exports.config = {
    allScriptsTimeout: 11000,
    directConnect: true,
    specs: [
        './src/**/*.e2e-spec.ts'
    ],


    onPrepare() {

        require('ts-node').register({
            project: require('path').join(__dirname, './tsconfig.json')
        });

        var fs = require('fs-extra');
        if (fs.existsSync(reportsDirectory)) {
            fs.removeSync(reportsDirectory);
        }
        if (!fs.existsSync(reportsDirectory) && !fs.existsSync(dashboardReportDirectory)) {
            fs.mkdirSync(reportsDirectory);
            fs.mkdirSync(dashboardReportDirectory);
        }
        // xml report for dashboard
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: reportsDirectory + '/xml',
            filePrefix: 'xmlOutput'
        }));

        jasmine.getEnv().addReporter({
            specDone: function(result) {
                if (result.status == 'failed') {
                    browser.getCapabilities().then(function(caps) {
                        var browserName = caps.get('browserName');
                        if (!fs.existsSync(imagesDir)) {
                            fs.mkdirSync(imagesDir);
                        }
                        browser.takeScreenshot().then(function(png) {
                            var stream = fs.createWriteStream(imagesDir + browserName + '-' + result.fullName + '.png');
                            stream.write(Buffer.from(png, 'base64'));
                            stream.end();
                        });
                    });
                }
            }
        });

    },

    onComplete: function() {
        var browserName, browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function(caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');
            platform = caps.get('platform');

            var HTMLReport = require('protractor-html-reporter-2');
            testConfig = {
                reportTitle: 'RelFinder Test Execution Report',
                outputPath: dashboardReportDirectory,
                outputFilename: 'index',
                screenshotPath: './images/',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: true,
                testPlatform: platform
            };
            new HTMLReport().from(reportsDirectory + '/xml/xmlOutput.xml', testConfig);
        });
    },
};