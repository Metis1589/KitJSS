new (require("../../base/KExClass"))()
    .extend(KWsBlackList, require("../../base/KBase"));

var SockJSConnection = require("../../node_modules/sockjs/lib/transport").SockJSConnection;

function KWsBlackList(){
    KWsBlackList.super.constructor.apply(this, arguments);
    /**
     * Blocked IP addresses of clients
     * @type {Array}
     */
    this.ip_blocks = [];
}

/**
 * To add a connection to the black list
 * @param conn {SockJSConnection}, client-server connection
 */
KWsBlackList.prototype.add = function(conn){
    this.ip_blocks.push(conn.remoteAddress);
}
/**
 * Checking the existence of connections in the black list
 * @param conn {SockJSConnection}, client-server connection
 * @returns {boolean}
 */
KWsBlackList.prototype.has = function(conn){
    return this.ip_blocks.indexOf(conn.remoteAddress) == -1 ? false : true;
}
/**
 * To delete a connection from the black list
 * @param conn {SockJSConnection}, client-server connection
 * @returns {boolean}
 */
KWsBlackList.prototype.remove = function(conn){
    var i;
    if ((i = this.ip_blocks.indexOf(conn.remoteAddress)) != -1){
        delete this.ip_blocks[i];
        return true;
    }
    return false;
}

module.exports = KWsBlackList;