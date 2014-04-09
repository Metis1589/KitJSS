var EventEmitter = require('events').EventEmitter;
var Log = require("./KLog");
var Crypto = require("crypto");
/**
 * The base class
 * @constructor
 */
function KBase(){
    /**
     * Log
     * @type {Log}
     */
    this.log = new Log();
    /**
     * Events
     * @type {EventEmitter}
     */
    this.event = new EventEmitter();
    /**
     * Encrypt
     * @type {*}
     */
    this.crypto = Crypto;
}
module.exports = KBase;