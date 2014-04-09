var KMySqlDb = require("../components/KMySqlDb");

new (require("./KExClass"))().extend(KModel, require("./KBase"));

/**
 * Model
 * @extends KBase
 * @constructor
 */
function KModel(){
    KModel.super.constructor.apply(this, arguments);
    /**
     * Record is not found
     * @type {number}
     */
    this.ERR_NOT_FOUND = -1;
    /**
     * Connection to DB
     * @type {KMySqlDb}
     */
    this.db = global.KMySqlDb;
    /**
     * The name table
     * @type {string}
     */
    this.table_name = "";
}
/**
 * Set up a connection to the database
 * @param callback function(e, connection), callback function
 * @param database string, name database
 */
KModel.prototype.getConnection = function(callback, database){
    if ((typeof database == "undefined") || !database){
        this.db.connect(callback, "");
    }else{
        this.db.connect(callback, database);
    }
}
/**
 * Escaping values for SQL query
 * @param value String, values
 * @return string, screened value
 */
KModel.prototype.escapeValue = function(value){
    return this.db.mysql.escape(value);
}
/**
 * Escaping parameters for SQL query
 * @param param string, name parameter
 * @return string, screened parameter
 */
KModel.prototype.escapeParam = function(param){
    return this.db.mysql.escapeId(param);
}
/**
 * Formation SQL expression with parameters
 * @param sql string, SQL expression
 * @param params {}, attributes
 * @returns {*}
 * @example
 * var sql = model.formationSql('SELECT * FROM :table_name as `t` WHERE t.id=:id',{
 *          params:{
 *              ":table_name" : table_name
 *          },
 *          values:{
 *              ":id" : id
 *          }
 *      }
 * );
 */
KModel.prototype.formationSql = function(sql, params){
    for(var p in params){
        if (p == "values"){
            for(var a in params[p]){
                sql = sql.replace(new RegExp(a,'g'), this.escapeValue(params[p][a]));
            }
        }else if (p == "params"){
            for(var a in params[p]){
                sql = sql.replace(new RegExp(a,'g'), this.escapeParam(params[p][a]));
            }
        }
    }
    return sql;
}
/**
 * Run SQL query
 * @param sql string, SQL expression
 * @param callback function(e, rows), callback function
 * @example
 * this.getConnection(
 *      function(e, connection){
 *          if (!e){
 *              self.queryArray(connection, sql, "uid", callback);
 *          }
 *      }
 * );
 */
KModel.prototype.query = function(connection, sql, callback){
    var self = this;
    self.log.beginProfile(sql);
    connection.query(sql,
        function(e, rows){
            if (!e){
                self.log.print("[>] [" + self.log.endProfile(sql) + " sec.] SQL query: " + sql);
                // if INSERT sql query
                if (rows.insertId){
                    // returns last insert id record
                    callback.call(self, false, rows.insertId);
                }else if (rows.length > 0){
                    callback.call(self, false, rows);
                }else{
                    // records is not found
                    callback.call(self, self.ERR_NOT_FOUND);
                }
            }else{
                callback.call(self, e);
            }
        }
    );
}
/**
 * Record search by id
 * @param id number, record id
 * @param callback function(e, rows)
 */
KModel.prototype.queryById = function(connection, id, callback){
    var sql = this.formationSql('SELECT * FROM ' + this.table_name + ' AS `t` WHERE t.id=:id',{
            "values":{
                ":id" : id
            }
        }
    );
    this.query(connection, sql, callback);
}
/**
 * Run the query and return an array of records selected attribute or array of attributes
 * @param sql string, SQL expression
 * @param attributes string|[], attribute or array of attributes
 * @param callback function(e, rows)
 */
KModel.prototype.queryArray = function(connection, sql, attributes, callback){
    this.query(connection, sql,
        function(e, rows){
            if (!e){
                var res = [];
                // если атрибуты являются массивом
                if (attributes instanceof Array){
                    for (var r in rows){
                        var d = new Object();
                        for (var a in attributes){
                            d[attributes[a]] = rows[r][attributes[a]];
                        }
                        res.push(d);
                    }
                }else{
                    for (var r in rows){
                        res.push(rows[r][attributes]);
                    }
                }
                callback.call(this, false, res);
            }else{
                callback.call(this, e);
            }
        }
    );
}

module.exports = KModel;