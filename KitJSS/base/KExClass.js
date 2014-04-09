/**
 * Extend classes
 * @constructor
 */
function KExClass(){
}
/**
 * Extend class
 * @param child function, child class
 * @param parent function, parent class
 */
KExClass.prototype.extend = function(child, parent){
    var F = function() { }
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.super = parent.prototype;
}

module.exports = KExClass;