/**
 * Events
 * @type {{
 *      SOCKET_ON_MESSAGE: string, When receiving a message from the server
 *      SOCKET_SEND_MESSAGE: string, Sending messages to the server
 *      CLIENT_CONNECTED: string, Client has been successfully connected to the server
 *      CLIENT_DISCONNECTED: string, The client has been disconnected from the server
 *      CLIENT_PING_PONG: string, Customer survey
 * }}
 */
var ClientSocketEvents = {
    SOCKET_ON_MESSAGE: "socket_on_message",
    SOCKET_SEND_MESSAGE: "socket_send_message",
    CLIENT_CONNECTED: "client_connected",
    CLIENT_DISCONNECTED: "client_disconnected",
    CLIENT_PING_PONG: "client_ping_pong",
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
                this.socket = new SockJS(client_options.server);
                /**
                 * Open WebSocket server
                 */
                this.socket.onopen = function(){
                    self.send({"login": {"sid": client_options.sid}});
                };
                /**
                 * When a message arrives from the server
                 * @param e {}, event
                 */
                this.socket.onmessage = function(e){
                    try{
                        var msg = JSON.parse(e.data);
                        $(document).trigger(ClientSocketEvents.SOCKET_ON_MESSAGE, msg);
                    }catch(e){
                        trace("Error: " + e.message);
                    }
                };
                this.socket.onclose = function(){
                    self.errors.push(self.ERR_SERVER_NOT_AVAILABLE);
                    $(document).trigger(ClientSocketEvents.CLIENT_DISCONNECTED);
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
         *
         * @constructor
         */
        this.Client = function(){
            /**
             * Successful client-server connection
             * @param command {}, command transmitted from the server
             */
            this.connected = function(command){
                // msg.u -> user_id
                $(document).trigger(ClientSocketEvents.CLIENT_CONNECTED);
            };
            this.disconnected = function(){
                $(document).trigger(ClientSocketEvents.CLIENT_DISCONNECTED);
            };
            this.ping_pong = function(command){
                $(document).trigger(ClientSocketEvents.CLIENT_PING_PONG);
                // sending a response message to the server
                $(document).trigger(ClientSocketEvents.SOCKET_SEND_MESSAGE,
                    {"client":{"a":"ping_pong","t":command.t}});
            }
        };
        /**
         * Displaying message received from server
         * @constructor
         */
        this.Alert = function(){
            this.out = function(msg){
                alert(msg);
            }
        };
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
        for (var c in options){
            if (typeof options[c].events == "object"){
                for (var e in options[c].events){
                    $(document).on(e, options[c].events[e]);
                }
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
                "client": new commands.Client(),
                "alert": new commands.Alert(),
            }
            $(document).on(ClientSocketEvents.SOCKET_ON_MESSAGE, function(e, data){
                self.processSignalingMessage(data);
            });
            $(document).on(ClientSocketEvents.SOCKET_SEND_MESSAGE, function(e, data){
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