new (require("../" + global.KitJSSPath + "base/KExClass"))()
    .extend(Calc, require("../" + global.KitJSSPath + "components/WsServer/command/KWsNormalCommand"));

function Calc(){
    Calc.super.constructor.apply(this, arguments);
    var calc = this;
    /**
     * List of functions available for the call coming from the client team
     */
    this.public = {
        /**
         * Summation passed array values
         * @param conn {SockJSConnection}, client-server connection
         * @param command function, instance command
         * @returns {boolean}
         */
        sum: function(conn, command){
            return calculation.call(this, conn, command);
        },
        sub: function(conn, command){
            return calculation.call(this, conn, command);
        },
        mul: function(conn, command){
            return calculation.call(this, conn, command);
        },
        div: function(conn, command){
            return calculation.call(this, conn, command);
        }
    };
    /**
     * The function for calculation
     * @param operation
     * @returns {boolean}
     */
    function calculation(conn, command){
        if ((typeof command.v == "object") && (command.v instanceof Array)){
            var r = parseInt(command.v[0]);
            var i = 0;
            var v;
            for (var i = 1; i < command.v.length; i++){
                v = parseFloat(command.v[i]);
                if (command.a == "sum"){
                    r += v;
                }else if (command.a == "sub"){
                    r -= v;
                }else if (command.a == "mul"){
                    r *= v;
                }else if (command.a == "div"){
                    if (v == 0){
                        r = "Division by zero!";
                        break;
                    }
                    r /= v;
                }
            }
            // the sending result to client
            this.observer.sendClient.call(this, conn, {
                    "calc": {
                        "a": "result",
                        "v": r
                    }
                }
            );
            return true;
        }
        return false;
    }
}

module.exports = Calc;