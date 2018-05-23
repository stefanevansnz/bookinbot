// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*_spec.ts'
    //'./e2e/**/authentication_spec.ts',
    //'./e2e/**/resources_spec.ts',
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      //args: [ "--headless", "--disable-gpu", "--window-size=800,600" ]
      args: [ "--disable-gpu", "--window-size=800,600" ]
    }
 
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    //jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    jasmine.getEnv().addReporter({

      specDone: function (spec) {
          console.log('spec.status is ' + spec.status);
          if (spec.status === 'failed') {
              console.dir(spec.failedExpectations.length);
              console.log(spec.failedExpectations[0].message);
              console.log(spec.failedExpectations[0].stack);
              //browser.enterRepl();
          }
      }
    });

    return browser.takeScreenshot(); 
  }
};
