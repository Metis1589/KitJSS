var config = {
    "host": "localhost",
    "user": "Mihail",
    "password": "123",
    "database": "kitjss"
    //"cache": false,
    //"max_connections": 1
}

new (require("../../base/KExClass"))().extend(TestModel, require("../../base/KModel"));
/**
 * @constructor
 */
function TestModel(){
    TestModel.super.constructor.apply(this, arguments);

    this.table_name = "model_test";

    this.queryTest = function(callback){
        var self = this;
        this.getConnection(function(e, connection){
            if (!e){
                var sql = self.formationSql('SELECT * FROM :table',{
                    "params":{
                        ":table": self.table_name
                    }
                });
                self.query(connection, sql, callback);
            }else{
                callback.call(this, e);
            }
        });
    }
    this.queryTest2 = function(callback){
        var self = this;
        this.getConnection(function(e, connection){
            if (!e){
                var sql = self.formationSql('SELECT * FROM :table',{
                    "params":{
                        ":table": "not_consist_table"
                    }
                });
                self.query(connection, sql, callback);
            }else{
                callback.call(this, e);
            }
        });
    }
    this.queryArrayTest = function(callback){
        var self = this;
        this.getConnection(function(e, connection){
            if (!e){
                var sql = self.formationSql('SELECT * FROM :table',{
                    "params":{
                        ":table": self.table_name
                    }
                });
                self.queryArray(connection, sql, "value", callback);
            }else{
                callback.call(this, e);
            }
        });
    }
    this.queryArrayTest2 = function(callback){
        var self = this;
        this.getConnection(function(e, connection){
            if (!e){
                var sql = self.formationSql('SELECT * FROM :table',{
                    "params":{
                        ":table": self.table_name
                    }
                });
                self.queryArray(connection, sql, ["id", "value"], callback);
            }else{
                callback.call(this, e);
            }
        });
    }
    this.queryByIdTest = function(id, callback){
        var self = this;
        this.getConnection(function(e, connection){
            if (!e){
                self.queryById(connection, id, callback);
            }else{
                callback.call(this, e);
            }
        });
    }
}
var test_model = new TestModel();
test_model.log.show = false;
test_model.db = new (require("../../components/KMySqlDb"))(config);
test_model.db.log.show = false;

exports.queryTest = function(test){
    test_model.queryTest(function(e, rows){
        if (!e){
            test.ok(rows[0].value == 7475);
        }else{
            test.ok(false);
        }
        test.done();
    });
}

exports.queryTest2 = function(test){
    test_model.queryTest2(function(e, rows){
        if (!e){
            test.ok(false);
        }else{
            test.ok(true);
        }
        test.done();
    });
}

exports.queryArrayTest = function(test){
    test_model.queryArrayTest(function(e, rec){
        if (!e){
            test.ok(rec[0] == 7475);
        }else{
            test.ok(false);
        }
        test.done();
    });
}

exports.queryArrayTest2 = function(test){
    test_model.queryArrayTest2(function(e, rec){
        if (!e){
            test.ok(rec[0].value == 7475);
        }else{
            test.ok(false);
        }
        test.done();
    });
}

exports.queryByIdTest = function(test){
    test_model.queryByIdTest(1, function(e, rec){
        if (!e){
            test.ok(rec[0].value == 7475);
        }else{
            test.ok(false);
        }
        test.done();
    });
}