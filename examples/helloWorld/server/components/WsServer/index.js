new (require("../../" + global.KitJSSPath + "base/KExClass"))()
    .extend(WsServer, require("../../" + global.KitJSSPath + "components/WsServer"));

/**
 * Initialize and start WebSocket server
 * @extends AKWsServer
 * @param config
 * @constructor
 */
function WsServer(config){
    WsServer.super.constructor.apply(this, arguments);
    this.config = config;

    var http_server = this.createHttpServer();
    var controller = new (require("./Controller"))();
    this.openWsServer(http_server, "/rtc", controller);
}

module.exports = WsServer;