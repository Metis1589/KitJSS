var LogTypeEnum = {
    TYPE_INFO: 0,
    TYPE_WARN: 1,
    TYPE_ERROR: 2
}
/**
 * The log
 * @constructor
 */
function KLog(){
    this.TYPE_INFO = 0;
    this.TYPE_WARN = 1;
    this.TYPE_ERROR = 2;
    this.TYPE_TRACE = 3;

    this.show = true;

    this.log = [];
    /**
     * Profiling
     * @type {Array}
     */
    this.profiling = [];
}
/**
 * Add item to log
 * @param text String, message
 * @param type {LogTypeEnum}
 */
KLog.prototype.add = function(text, type){
    this.log.push({"text": text, "type": type || 0});
}
/**
 * Print all add messages
 * @param type {LogTypeEnum}
 */
KLog.prototype.printAll = function(type){
    for (var v in this.log){
        this.print(this.log[v].text, type);
    }
    this.log = [];
}
/**
 * Print message
 * @param text String, message
 * @param type {LogTypeEnum}
 */
KLog.prototype.print = function(text, type){
    if (this.show){
        var dn = new Date();
        console.log(dn.getDate() + "." + (dn.getMonth() + 1) + "." + dn.getFullYear() + " " +
            dn.getHours() + ":" + dn.getMinutes() + ":" + dn.getSeconds() + " " +
            this.setColor(text,
            ((typeof type == "undefined") || (type == this.TYPE_INFO)) ? 4 :
                (type == this.TYPE_WARN ? 1 : (type == this.TYPE_ERROR ? 9 :
                    (type == this.TYPE_TRACE ? 4 :
                        -1)))));
    }
}
/**
 * Displaying color text with fill background
 * @param str String, message
 * @param color Number, color message
 * @param bg Number, color background
 *
 -1 The default color
 0 Black
 1 Red
 2 Green
 3 Dark yellow
 4 Dark Blue
 5 Dark purple
 6 Dark blue
 7 Light gray
 8 Dark gray
 9 Bright red
 10 Bright Green
 11 Yellow
 12 Blue
 13 Purple
 14 Blue
 15 White
 */
KLog.prototype.setColor = function(str, color, bg){
    var prefix = '\u001b[';
    var reset = '0m';
    if((typeof bg !== 'undefined') && (bg !== -1)){
        str = prefix + '4' + (bg % 8) +  (bg / 8 > 1 ? ';1' : '') + 'm' + str;
    }
    if((typeof color !== 'undefined') && (color !== -1)){
        str = prefix + '3' + (color % 8) + (color / 8 > 1 ? ';1' : '') + 'm' + str;
    }
    str = prefix + reset + str;
    return str + prefix + reset;
}
/**
 * Start profiling
 * @param label String, label
 */
KLog.prototype.beginProfile = function(label){
    if (this.show){
        this.profiling[label] = process.hrtime();
    }
}
/**
 * End profiling
 * @param label String, label
 * @returns {String}, time
 */
KLog.prototype.endProfile = function(label){
    if (this.show){
        var diff = process.hrtime(this.profiling[label]);
        return ((diff[0] * 1e9 + diff[1]) / 1e9).toFixed(5);
    }
    return "";
}

module.exports = KLog;