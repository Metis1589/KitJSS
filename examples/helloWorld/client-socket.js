/**
 * Events
 * @type {{
 *      SOCKET_STATUS_WAIT:
 *      SOCKET_STATUS_CONNECT:
 *      SOCKET_STATUS_DISCONNECT:
 *      SOCKET_ON_MESSAGE: string, When receiving a message from the server
 *      SOCKET_SEND_MESSAGE: string, Sending messages to the server
 *      CALC_RESULT:
 * }}
 */
var SocketEvents = {
    SOCKET_STATUS_WAIT: "socket_status_wait",
    SOCKET_STATUS_CONNECT: "socket_status_connect",
    SOCKET_STATUS_DISCONNECT: "socket_status_disconnect",
    SOCKET_ON_MESSAGE: "socket_on_message",
    SOCKET_SEND_MESSAGE: "socket_send_message",
    CALC_RESULT: "calc_result",
}
var ClientSocket = function(options){
    var client_options = options.client.options;
    /**
     * The model list
     * @constructor
     */
    function Models(){
        /**
         * WebSocket сервер
         */
        this.WsServer = new (function(){
            var self = this;
            this.socket = null;
            // error list
            this.errors = [];
            /**
             * Error. Server is unavailable.
             */
            this.ERR_SERVER_NOT_AVAILABLE = "err_server_not_available";

            this.init = function(){
                $(document).trigger(SocketEvents.SOCKET_STATUS_WAIT);
                this.socket = new SockJS(client_options.server);
                /**
                 * Open WebSocket server
                 */
                this.socket.onopen = function(){
                    $(document).trigger(SocketEvents.SOCKET_STATUS_CONNECT);
                };
                /**
                 * When a message arrives from the server
                 * @param e {}, event
                 */
                this.socket.onmessage = function(e){
                    try{
                        var msg = JSON.parse(e.data);
                        $(document).trigger(SocketEvents.SOCKET_ON_MESSAGE, msg);
                    }catch(e){
                        trace("Error: " + e.message);
                    }
                };
                this.socket.onclose = function(){
                    self.errors.push(self.ERR_SERVER_NOT_AVAILABLE);
                    $(document).trigger(SocketEvents.SOCKET_STATUS_DISCONNECT);
                };
            };
            /**
             * Sending commands to a WebSocket server
             * @param command {}, command
             */
            this.send = function(command){
                if (this.socket != null){
                    if (this.errors.indexOf(this.ERR_SERVER_NOT_AVAILABLE) == -1){
                        this.socket.send(JSON.stringify(command));
                    }else{
                        alert("WebSocket server not available!");
                    }
                }else{
                    // WebSocket клиент не проинициализирован
                    alert("WebSocket client is not initialized!");
                }
            };
        });
    }
    /**
     * Views
     * @param models Models
     * @constructor
     */
    function Views(models){};
    /**
     * The command list
     * @constructor
     */
    function Commands(){
        /**
         * Displaying message received from server
         * @constructor
         */
        this.Alert = function(){
            this.out = function(msg){
                alert(msg);
            }
        };
        this.Calc = function(){
            this.result = function(command){
                $(document).trigger(SocketEvents.CALC_RESULT, command.v);
            }
        }
    };
    /**
     * Controllers
     * @param models {Models}
     * @param views {Views}
     * @param commands {Commands}
     * @constructor
     */
    function Controllers(models, views, commands){
        // bind events
        function bindEvents(events){
            for (var e in events){
                if (typeof events[e] == "function"){
                    $(document).on(e, events[e]);
                }
            }
        }
        for (var c in options){
            if (c != "events"){
                if (typeof options[c].events == "object"){
                    bindEvents(options[c].events);
                }
            }else{
                bindEvents(options[c]);
            }
        };
        /**
         * WebSocket server
         * @constructor
         */
        this.WsServer = function(){
            var self = this;
            // The command list
            this.commands = {
                "alert": new commands.Alert(),
                "calc": new commands.Calc(),
            }
            $(document).on(SocketEvents.SOCKET_ON_MESSAGE, function(e, data){
                self.processSignalingMessage(data);
            });
            $(document).on(SocketEvents.SOCKET_SEND_MESSAGE, function(e, data){
                models.WsServer.send(data);
            });
            // the init WebSocket server
            models.WsServer.init();
        };
        /**
         * Command processing
         * @param msg
         */
        this.WsServer.prototype.processSignalingMessage = function(msg){
            for(var s in msg){
                if (typeof this.commands[s] == "object"){
                    switch(s){
                        case "alert":
                            this.commands[s].out(msg[s]);
                            break;
                        default:
                            if (typeof this.commands[s][msg[s].a] == "function"){
                                this.commands[s][msg[s].a].call(this.commands[s], msg[s]);
                            }
                            break;
                    }
                }else{

                }
            }
        }
    };

    var models = new Models();
    var views = new Views(models);
    var commands = new Commands();
    var controllers = new Controllers(models, views, commands);
    new controllers.WsServer();
}