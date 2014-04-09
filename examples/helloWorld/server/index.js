var v = process.argv[2] || 'develop';
var config = {
    /**
     * Directory to the components
     */
    "dir_components": "examples/helloWorld/server/components/",
    "components":{
        "WsServer": {
            "class": "WsServer",
            "host": v == 'develop' ? "localhost" : "24.45.78.55"
        }
    }
};
// path KitJSS framework
global.KitJSSPath = "../../../KitJSS/";
// run server application
(app = require(global.KitJSSPath + "KitJSS")).init(config);
// the printing log
app.log.printAll();


