new (require("../../base/KExClass"))().extend(KWsController, require("../../base/KBase"));

var Commands = require("../../commands");
/**
 * Controller for processing requests
 * @extends KBase
 * @constructor
 */
function KWsController(){
    KWsController.super.constructor.apply(this, arguments);
    /**
     * List of server commands
     * @type {{}}
     */
    this.commands = {
        "client": new Commands.Client()
    };
}
/**
 * Upon receiving a request from a client
 * @param conn {SockJSConnection}, client-server connection
 * @param message String, transmitted from the client team
 * @this KWsServer
 */
KWsController.prototype.onData = function(conn, message){
    try{
        this.log.print("[->][" + conn.prefix + "] Receiver command: " + message);
        var commands = JSON.parse(message);
        this.controller.parseCommand.call(this, conn, commands);
    }catch(e){
        this.observer.sendTextMessage.call(this, conn, e.message);
    }
}
/**
 * Closing the connection with the client
 * @param conn {SockJSConnection}, client-server connection
 * @this KWsServer
 */
KWsController.prototype.onClose = function(conn){
}
/**
 * Example command to the server
 */
var Command = {
    "name command": {
        "a": "name function",
        "params" : ""
        //... etc.
    }
}
/**
 * Processing commands from the client
 * @param conn {SockJSConnection}, client-server connection
 * @param command {Command}, transmitted from the client team
 * @this KWsServer
 * @example command:
 *      {"login": {"sid": "e4d10s85g0r5FE"}}
 *      {"call": {"a": "inquiry", "u": 45}}
 */
KWsController.prototype.parseCommand = function(conn, commands){
    try{
        // разбор присланных команд
        for(var c in commands){
            // c -> название команды
            // если команда существует в списке команд
            if (!this.controller.commands.hasOwnProperty(c)){
                throw new Error("Invalid request! The command of '" + c + "' is not defined!");
            }
            // вызов функции для обработки команды
            this.controller.callCommand.call(this, conn, c, commands[c]);
        }
    }catch(e){
        this.log.print(e.message, this.log.TYPE_ERROR);
        this.observer.sendTextMessage.call(this, conn, e.message);
    }
}
/**
 * Call function to process the command
 * @param conn {SockJSConnection}, client-server connection
 * @param nc String, name command
 * @param command function, copy command
 * @this KWsServer
 */
KWsController.prototype.callCommand = function(conn, nc, command){
    try{
        var before = true;
        var entity = this.controller.commands[nc];
        if ((typeof command.a == "undefined") || !command.a){
            // function to process the default command
            command.a = "index";
        }
        if (typeof entity.public[command.a] != "function"){
            // "command.a" function not found
            throw new Error("The function command of [" + command.a + "] is not found!");
        }
        // the function before calling the command processing
        if (typeof this.controller.commands[nc].beforeCommand == "function"){
            before = entity.beforeCommand.call(this, conn, nc, command);
        }
        if (before){
            // execution of the command processing
            if (entity.public[command.a].call(this, conn, command)){
                // execution of the function after treatment command
                if (typeof entity.afterCommand == "function"){
                    entity.afterCommand.call(this, conn, nc, command);
                }
            }else{
                // "command.a" function returned false result
            }
        }else{
            // function "beforeCommand" returned false result
        }
    }catch(e){
        this.log.print(e.message, this.log.TYPE_ERROR);
        this.observer.sendTextMessage.call(this, conn, e.message);
    }
}

module.exports = KWsController;