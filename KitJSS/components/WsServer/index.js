var KWsController = require("./KWsController");
var KWsObserver = require("./KWsObserver");
var Http = require("http");
var Sockjs = require("sockjs");
var KWsBlackList = require("./KWsBlackList");
var SockJSConnection = require("../../node_modules/sockjs/lib/transport").SockJSConnection;

new (require("../../base/KExClass"))().extend(KWsServer, require("../../base/KComponent"));

var Config = {
    "host": String,
    "port": Number,
    "prefix": String
};
/**
 * WebSocket server
 * @extends KComponent
 * @param config {Config}
 * @constructor
 */
function KWsServer(config){
    KWsServer.super.constructor.apply(this, arguments);

    this.http = Http;
    this.sock = Sockjs;
    this.DELAY_PING_PONG = 30000;
    /**
     * Configuration
     * @type {Config}
     */
    this.config = {};
    /**
     * Array of connections to the server
     * @type {Array}
     */
    this.connections = [];

    this.black_list = new KWsBlackList();
    /**
     * Controller for processing requests
     * @type {KWsController}
     */
    this.controller = new KWsController();
    /**
     * Class to send request to the client
     * @type {KWsObserver}
     */
    this.observer = new KWsObserver();
}
/**
 * Creating an HTTP server
 * @return {Server}
 */
KWsServer.prototype.createHttpServer = function(){
    return this.http.createServer(
        function (request, response){
            response.writeHead(200, {
                    'Content-Type': 'text/plain'
                }
            );
            response.end('You connection to the server\n');
        }
    );
}
/**
 * Opening WebSocket server
 * @param server {Server}, instance http server, web server object
 * @param prefix String, prefix access to WebSocket server
 * @param controller {KWsController}, controller for processing requests
 * @param observer {KWsObserver}, sending commands to the client
 */
KWsServer.prototype.openWsServer = function(server, prefix, controller, observer){
    var self = this;
    if (!(server instanceof this.http.Server)){
        throw new Error("server is not instance Server!");
    }
    if (!prefix){
        throw new Error("WebSocket prefix is not installed!");
    }
    this.controller = controller || new KWsController();
    if (!(this.controller instanceof KWsController)){
        throw new Error("controller is not instance AKWsController!");
    }
    this.observer = observer || new KWsObserver();
    if (!(this.observer instanceof KWsObserver)){
        throw new Error("observer is not instance AKWsObserver!");
    }

    var sock_server = this.sock.createServer();
    sock_server.installHandlers(server, {
            prefix: prefix
        }
    );
    server.listen(this.config.port, this.config.host);
    sock_server.on('connection',
        function(conn){
            // when data is received from the client
            conn.on('data',
                function(message){
                    if (self.black_list.has(conn) === true){
                        self.observer.sendTextMessage.call(self, conn, "Your IP addess was blocked!");
                    }else{
                        self.controller.onData.call(self, conn, message);
                    }
                }
            );
            // close the connection with the client
            conn.on('close',
                function(){
                    self.controller.onClose.call(self, conn);
                }
            );
        }
    );
    /*setTimeout(function(){
        for (var c in self.connections){
            self.observer.sendClient.call(self, c,
                {"client":{"a":"ping_pong","t":process.hrtime()}});
        }
        setTimeout(arguments.callee, self.DELAY_PING_PONG);
    });*/
}

/**
 * Проверка подключен ли клиент к серверу
 * @param conn {SockJSConnection} | int, client-server connection
 * @returns {SockJSConnection}
 */
KWsServer.prototype.isClientConnected = function(conn){
    var id = (conn instanceof SockJSConnection) ? conn.u : conn;
    // перебор всех подключений к серверу
    for (var c in this.connections){
        if (c == id){
            return this.connections[c];
        }
    }
    return false;
}

module.exports = KWsServer;