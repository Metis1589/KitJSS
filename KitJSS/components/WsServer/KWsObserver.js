new (require("../../base/KExClass"))().extend(KWsObserver, require("../../base/KBase"));

var SockJSConnection = require("../../node_modules/sockjs/lib/transport").SockJSConnection;

/**
 * @extends KBase
 * @constructor
 */
function KWsObserver(){
    KWsObserver.super.constructor.apply(this, arguments);
}
/**
 * Subscribe commands to all clients that are connected to WebSocket server
 * @param conn {SockJSConnection}, client-server connection
 * @param command {}, command
 * @this KWsServer
 */
KWsObserver.prototype.dispatch = function(conn, command){
    // если клиент подключен к серверу
    if (this.isClientConnected(conn) !== false){
        this.observer.sendClient.call(this, conn, command);
    }
}
/**
 * Sending messages to the client
 * @param where Number|{SockJSConnection}, id client connection or instance
 * @param command {}, transmitted command
 * @this KWsServer
 */
KWsObserver.prototype.sendClient = function(where, command){
    if (!(where instanceof SockJSConnection)){
        if (this.connections.hasOwnProperty(where)){
            this.connections[where].write(JSON.stringify(command));
        }
    }else{
        where.write(JSON.stringify(command));
    }
}
/**
 * Sending a text message to the client
 * @param where Number|SockJSConnection, id client connection or instance
 * @param message String, message
 * @this KWsServer
 */
KWsObserver.prototype.sendTextMessage = function(where, message){
    this.observer.sendClient.call(this, where, {"alert" : message});
}

module.exports = KWsObserver;