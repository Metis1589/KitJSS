new (require("./KExClass"))().extend(KComponent, require("./KBase"));

/**
 * Base component class
 * @extends KBase
 * @constructor
 */
function KComponent(){
    KComponent.super.constructor.apply(this, arguments);

    this.config = arguments["0"];
}

module.exports = KComponent;