new (require("../../" + global.KitJSSPath + "base/KExClass"))()
    .extend(Controller, require("../../" + global.KitJSSPath + "components/WsServer/KWsController"));

var Commands = require("../../commands");

/**
 * @extends AKWsServer
 * @constructor
 */
function Controller(){
    Controller.super.constructor.apply(this, arguments);
    /**
     * The command list
     * @type {{}}
     */
    this.commands["calc"] = new Commands.Calc();
}
module.exports = Controller;