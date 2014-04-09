var CacheSql = require("../components/KCacheSql");

new (require("./KExClass"))().extend(KCacheModel, require("./KModel"));

/**
 * The cache model
 * @extends KModel
 * @constructor
 */
function KCacheModel(){
    KCacheModel.super.constructor.apply(this, arguments);
    /**
     * @type {CacheSql}
     */
    this.cache_sql = global.KCacheSql;
}
/**
 * Run SQL query caching
 * @param time Number, cache time SQL query, sec.
 * @param sql string, SQL expression
 * @example
 * this.getConnection(
 *      function(e, connection){
 *          if (!e){
 *              var sql = SQL expression;
 *              self.cacheQuery(connection, 60 * 2, sql, callback);
 *          }
 *     }
 * );
 */
KCacheModel.prototype.cacheQuery = function(connection, time, sql, callback){
    var self = this;
    if (!this.cache_sql.fromCache(sql, callback)){
        self.query(connection, sql,
            function(e, rows){
                if (!e){
                    self.cache_sql.cache(sql, rows, time);
                }
                callback.call(self, e, rows);
            }
        );
    }
}
/**
 * Perform caching SQL query and return an array of records selected attribute or array of attributes
 * @param time Number, cache time SQL query, sec.
 * @param sql string, SQL expression
 * @param attributes string|[], attribute or array of attributes
 * @example
 * this.getConnection(
 *      function(e, connection){
 *          if (!e){
 *              var sql = SQL expression;
 *              self.cacheQueryArray(connection, 60 * 2, sql, ""|[], callback);
 *          }
 *     }
 * );
 */
KCacheModel.prototype.cacheQueryArray = function(connection, time, sql, attributes, callback){
    var self = this;
    if (!this.cache_sql.fromCache(sql, callback)){
        self.queryArray(connection, sql, attributes,
            function(e, res){
                if (!e){
                    self.cache_sql.cache(sql, res, time);
                }
                callback.call(self, e, res);
            }
        );
    }
}

module.exports = KCacheModel;