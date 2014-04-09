new (require("../base/KExClass"))().extend(KCacheSQL, require("../base/KComponent"));

/**
 * Configuration
 * @type {{}}
 */
var Config = {
    // the time auto clear cache, sec., by default is set in 15 min.
    "time_clear": Number
}
/**
 * The object data stored in the RAM
 * @type {{rows: Array, exp: Number}}
 */
var CacheData = {
    // the result of a sql query
    rows: [],
    // time data storage in the memory
    exp: Number
}
/**
 * Caching SQL queries
 * @extends KComponent
 * @param config {Config}
 * @constructor
 */
function KCacheSQL(config){
    KCacheSQL.super.constructor.apply(this, arguments);

    this.TIME_CLEAR_CACHE = config.time_clear || this.TIME_CLEAR_CACHE;

    /**
     * The automatic cache clearing
     * @type {number}
     */
    this.TIME_CLEAR_CACHE = 900; // 15 мин.
    /**
     * Array of cached queries
     * @type {CacheData}
     */
    this.cache_sql = [];

    this.autoClear();
}
/**
 * Taking data from the cache
 * @param sql String, SQL expression
 * @param callback function(e, rows)
 * @returns {boolean}, if true, then the data is cached
 */
KCacheSQL.prototype.fromCache = function(sql, callback){
    // SQL expression to SHA1
    sql = this.sqlToSha1(sql);
    this.log.beginProfile(sql);
    // query is found in the cache array
    if (this.cache_sql.hasOwnProperty(sql) &&
        // If the time in the cache storage request = 0
        ((this.cache_sql[sql].exp == 0) || (this.cache_sql[sql].exp > (new Date().getTime()))))
    {
        this.log.print("[*] [" + this.log.endProfile(sql) + " sec.] SQL request from cache: " + sql);
        callback.call(this, false, this.cache_sql[sql].rows);
        return true;
    }
    return false;
}
/**
 * SQL query to SHA1
 * @param sql String, SQL expression
 */
KCacheSQL.prototype.sqlToSha1 = function(sql){
    var sha = this.crypto.createHash("sha1");
    sha.update(sql);
    return sha.digest("hex");
}
/**
 * Sql query cache
 * @param sql String, SQL expression
 * @param rows [], the result of a SQL query
 */
KCacheSQL.prototype.cache = function(sql, rows, time){
    this.log.print("[+] Add SQL request to cache: " + sql + ".\n\tCrypt to [" + (sql = this.sqlToSha1(sql)) + "]");
    this.cache_sql[sql] = {};
    // result
    this.cache_sql[sql].rows = rows;
    // time data storage in the memory
    this.cache_sql[sql].exp = ((time == undefined) || (time == 0)) ? 0 : new Date().getTime() + time * 1000;
}
/**
 * Clearing the cache on the storage time sql query in memory
 * @param sql String, SQL expression
 */
KCacheSQL.prototype.clearByExpire = function(sql){
    // storage time has elapsed in a cache request
    if ((this.cache_sql[sql].exp != 0) && (this.cache_sql[sql].exp < (new Date().getTime()))){
        this.log.print("[-] Clear SQL request from cache: " + sql);
        delete this.cache_sql[sql];
        return true;
    }
    return false;
}
/**
 * Clearing the cache
 * @param func function(), function to clear the cache
 * @returns {number}
 */
KCacheSQL.prototype.clearAll = function(func){
    var result = 0;
    for (var sql in this.cache_sql){
        result += (func.call(this, sql) === true ? 1 : 0);
    }
    return result;
}
/**
 * Automatic cleaning cache
 */
KCacheSQL.prototype.autoClear = function(){
    // if the time of clearing the cache is greater than 0
    if (this.TIME_CLEAR_CACHE > 0){
        var self = this;
        /**
         * Clearing the cache on a time interval
         */
        setTimeout(function(){
            var c = self.clearAll(self.clearByExpire);
            if (c > 0){
                self.log.print("Auto clear mem cache.");
            }
            setTimeout(arguments.callee, self.TIME_CLEAR_CACHE * 1000);
        });
    }
}

module.exports = KCacheSQL;