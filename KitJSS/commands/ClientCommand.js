new (require("../base/KExClass"))()
    .extend(Client, require("../components/WsServer/command/KWsNormalCommand"));

function Client(){
    Client.super.constructor.apply(this, arguments);
    var client = this;
    /**
     * Список функций доступных для вызова, поступающие с командой от клиента
     */
    this.public = {
        /**
         *
         * @param conn
         * @param command
         * @returns {boolean}
         */
        index: function(conn, command){

        },
        /**
         *
         * @param conn
         * @param command
         * @returns {boolean}
         */
        ping_pong: function(conn, command){
            var diff = process.hrtime(command.t);
            this.log.print("[<<|>>] ping-pong[" + conn.u + "]: " +
                ((diff[0] * 1e9 + diff[1]) / 1e9).toFixed(5) + " sec.", this.log.TYPE_TRACE);
        }
    };
}

module.exports = Client;