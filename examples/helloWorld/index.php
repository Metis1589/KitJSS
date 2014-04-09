<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>KitJSS example. Hello world</title>
        <link type="text/css" rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css"/>
        <script src="../../client/jquery-2.0.3.js"></script>
        <script src="../../client/sockjs-0.3.js"></script>
        <script src="client-socket.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            $(document).ready(function(){
                $("#btn-calc").attr("disabled","true");
                var config = {
                    "events":{
                        "socket_status_wait": function(){
                            $("#status")
                                .removeClass()
                                .addClass("label label-warning")
                                .html("Wait...");
                        },
                        "socket_status_connect": function(){
                            $("#btn-calc").removeAttr("disabled");
                            $("#status")
                                .removeClass()
                                .addClass("label label-info")
                                .html("Success connected");
                        },
                        "socket_status_disconnect": function(){
                            $("#btn-calc").attr("disabled","true");
                            $("#status")
                                .removeClass()
                                .addClass("label label-danger")
                                .html("Not connected");
                        }
                    },
                    "client":{
                        "options":{
                            "server": "http://localhost:1337/rtc"
                        }
                    },
                    "calc":{
                        "events":{
                            "calc_result": function(e, v){
                                $("#result").html(v);
                            }
                        }
                    }
                };
                new ClientSocket(config);
            });
            function calc(){
                $(document).trigger(SocketEvents.SOCKET_SEND_MESSAGE,{
                        "calc": {
                            "a": $("#operation option:selected").val(),
                            "v": [
                                $("#val-1").val() || 0,
                                $("#val-2").val() || 0
                            ]
                        }
                    }
                );
            }
        </script>
        <div class="wrapper">
            <h4 class="col-md-offset-1">Пример осуществления операций над двумя числами с использованием RTC</h4>
            <div class="col-md-5 col-md-offset-1">
                <label><strong>Status WebSocket server:</strong></label>
                <span id="status" class=""></span>
                <form class="form-inline well well-sm" role="form">
                    <div class="form-group">
                        <input id="val-1" class="form-control" type="text"/>
                        <select id="operation" class="form-control">
                            <option value="sub">-</option>
                            <option value="sum">+</option>
                            <option value="mul">*</option>
                            <option value="div">/</option>
                        </select>
                        <input id="val-2" class="form-control" type="text"/>
                        <button id="btn-calc" class="btn btn-primary" onClick="calc(); return false;">Calc</button>
                        <div>
                            <label><strong>Result:</strong></label>
                            <span id="result" class="label label-success"></span>
                        </div>
                    </div>
                </form>
                <div class="clearfix"></div>
            </div>
        </div>
    </body>
</html>