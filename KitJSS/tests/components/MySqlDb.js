var config = {
    "host": "localhost",
    "user": "Mihail",
    "password": "123",
    "main_db": "webrtc",
    //"max_connections": 1
}
var mysql = new (require("../../components/KMySqlDb"))(config);
//mysql.log.show = false;

exports.connectTest = function(test){
    var i = 0;
    for (i = 0; i < 10; i++){
        mysql.connect(function(e){
            if (!e){
                //test.ok(true);
            }else{
                //test.ok(false);
            }
            //test.done();
        },"webrtc_test");
        mysql.connect(function(e){
            if (!e){
                //test.ok(true);
            }else{
                //test.ok(false);
            }
            //test.done();
        },"webrtc");
    }
}

exports.closeConnectionTest = function(test){
    mysql.closeConnection("webrtc_test", function(e){
        if (!e){
            //test.ok(true);
        }else{
            //test.ok(false);
        }
        //test.done();
    });
}