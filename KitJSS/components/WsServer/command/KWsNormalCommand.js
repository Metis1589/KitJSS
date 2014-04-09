new (require("../../../base/KExClass"))().extend(KWsNormalCommand, require("../../../base/KBase"));
/**
 * Processing of the functions received with command
 * @extends KBase
 * @constructor
 */
function KWsNormalCommand(){
    KWsNormalCommand.super.constructor.apply(this, arguments);
    /**
     * List of functions available for the call coming from the client with command
     */
    this.public = {
    };
}
/**
 * The function is called before calling the command processing
 * @param conn {SockJSConnection}, client-server connection
 * @param name_command String, command name
 * @param command function, instance command
 * @returns {boolean}
 * @this AKWsServer
 */
KWsNormalCommand.prototype.beforeCommand = function(conn, name_command, command){
    this.log.print("[>>][" + conn.prefix + "] Before command function [" + command.a + "]");
    return true;
}
/**
 * The function is called after a successful call processing function command
 * @param conn {SockJSConnection}, client-server connection
 * @param name_command String, command name
 * @param command function, instance command
 * @this AKWsServer
 */
KWsNormalCommand.prototype.afterCommand = function(conn, name_command, command){
    this.log.print("[>>][" + conn.prefix + "] After command function [" + command.a + "]");
}

module.exports = KWsNormalCommand;