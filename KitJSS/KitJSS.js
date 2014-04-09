new (require("./base/KExClass"))()
    .extend(App, require("./base/KApp"));

/**
 * Server application
 * @extends KApp
 * @constructor
 */
function App(){
    App.super.constructor.apply(this, arguments);
}

// unit testing
//var reporter = require("nodeunit").reporters.default;
//reporter.run(['./KitJSS/tests','./KitJSS/tests/base','./KitJSS/tests/components']);

var app = new App();
module.exports = global.Kit = app;
