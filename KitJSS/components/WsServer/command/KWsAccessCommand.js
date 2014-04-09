new (require("../../../base/KExClass"))().extend(KWsAccessCommand, require("./KWsNormalCommand"));
/**
 * Processing of the functions received with command and testing access
 * @extends KWsNormalCommand
 * @constructor
 */
function KWsAccessCommand(){
    KWsAccessCommand.super.constructor.apply(this, arguments);
    /**
     * Rules to allow or deny access to the functions specified in the public
     * @example [{"index": ["*"]}]
     */
    this.rules = [];
}

/**
 * Verifying access to the function call
 * @param name_command String, command name
 * @param roles [], array of roles client
 */
KWsAccessCommand.prototype.checkAccess = function(name_command, roles){
    for (var o in this.rules){
        // f -> function name
        for (var f in this.rules[o]){
            if (f == name_command){
                // sorting rules
                for (var r in this.rules[o][f]){
                    var rule = this.rules[o][f][r];
                    if ((rule == "*") || (roles.indexOf(rule) != -1)){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
/**
 * The function is called before calling the command processing
 * @param conn {SockJSConnection}, client-server connection
 * @param name_command String, command name
 * @param command function, instance command
 * @returns {boolean}
 * @this AKWsServer
 */
KWsAccessCommand.prototype.beforeCommand = function(conn, name_command, command){
    if (KWsAccessCommand.super.beforeCommand.call(this, conn, name_command, command)){
        if (!this.controller.commands[name_command].checkAccess(command.a, conn.roles)){
            throw new Error("Can't access for function [" + command.a + "]!");
        }
        return true;
    }
}

module.exports = KWsAccessCommand;