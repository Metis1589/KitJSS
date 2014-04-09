new (require("../base/KExClass"))().extend(KMySqlDb, require("../base/KComponent"));

/**
 * Configuration
 */
var Config = {
    "host": String,
    "user": String,
    "password": String,
    "database": String,
    /**
     * max connections to DB. If the number connections more max connections and cache is on then
     * connection which less commonly used will be closed and create new connection
     */
    "max_connections": Number,
    /**
     * maximum connection timeout, sec.
     */
    "wait_timeout": Number
}

/**
 * Component to connect to MySQL database
 * @extends KComponent
 * @param config {Config}, Configuration
 * @constructor
 */
function KMySqlDb(config){
    KMySqlDb.super.constructor.apply(this, arguments);
    var self = this;
    /**
     * Maximum number of database connections
     * @type {number}
     */
    this.MAX_CONNECTIONS = 100;
    /**
     * An array of unique connections to the database
     * @type {Array}
     */
    this._connections = [];
    /**
     * Number of unique connections to the database
     * @type {number}
     */
    this._amount_conns = 0;

    this._wait_connection = false;

    this._connection = null;

    this.mysql = require('mysql');

    this.MAX_CONNECTIONS = config.max_connections || 50;
    this.WAIT_TIMEOUT = (config.wait_timeout || 30) * 1000;

    // closures of outdated connections
    setTimeout(function(){
        self.closeOutConnections();
        setTimeout(arguments.callee, 1000);
    },1000);
}
/**
 * Opening a database connection
 * @param callback function(e, connection)
 * @param database String, database name
 */
KMySqlDb.prototype.connect = function(callback, database){
    var self = this;
    /**
     * Wait until the previous connection is made, it is necessary to control the count
     * successful connections to the database, and caching connections
     */
    setTimeout(function(){
        if (self._wait_connection === false){
            self._wait_connection = true;
            database = database || self.config.database;
            self.log.beginProfile(database);
            if (self._connections.hasOwnProperty(database)){
                self._wait_connection = false;
                self.log.print("[*] [" + self.log.endProfile(database) + " sec.] MySql connection '" + database + "' from cache.");
                self.useConnect(database);
                if (typeof callback == "function"){
                    callback.call(self, false, self._connection);
                }else{
                    self.log.print("[!] Error find success function in connect to db!", self.log.TYPE_ERROR);
                }
            }else{
                // if the count of connections to the database exceeds the specified maximum number of connections
                if (self._amount_conns >= self.MAX_CONNECTIONS){
                    var nc = self.getUdrlNameConnection();
                    // closing connection
                    self.closeConnection(nc, function(){
                        this.createConnect.call(this, database, callback);
                    });
                }else{
                    self.createConnect.call(self, database, callback);
                }
            }
        }else{
            setTimeout(arguments.callee);
        }
    });
}

/**
 * Using connect to database
 * @param database String, database name
 * @returns {}, connection to db
 */
KMySqlDb.prototype.useConnect = function(database){
    if (this._connections[database].hasOwnProperty('used')){
        this._connections[database].used++;
    }else{
        // init
        this._connections[database].used = 1;
    }
    // the last time called
    this._connections[database].rtime = new Date().getTime();
    this._connection = this._connections[database];
    return this._connections[database];
}

/**
 * Create a new connection to the database
 * @param database String, database name
 * @param callback function(e, connection)
 */
KMySqlDb.prototype.createConnect = function(database, callback){
    var self = this;
    var conn = this.mysql.createConnection(this.config);
    var uri = this.getURI(database);
    // connection setup
    conn.connect(function(e){
        if (!e){
            self._connections[database] = conn;
            self.useConnect(database);
            // number of connections
            self._amount_conns++;
            self._wait_connection = false;
            self.log.print("[+] [" + self.log.endProfile(database) + " sec.] Open mysql connection to '" + uri + "'");
        }else{
            self.log.print("[!] Error mysql connection to '" + uri + "'", self.log.TYPE_ERROR);
        }
        if (typeof callback == "function"){
            callback.call(self, e, conn);
        }
    });
}
/**
 * Returns the address of the connection to the database
 * @param database String, database name
 * @returns {string}, uri address
 */
KMySqlDb.prototype.getURI = function(database){
    return this.config.host + "/" + database;
}
/**
 * Changing the database connection
 * @param callback function(e, connection)
 * @param database String, database name
 */
KMySqlDb.prototype.changeConnection = function(callback, database){
    database = database || this.config.database;
    if (this._connections.hasOwnProperty(database)){
        this._connection = this._connections[database]
        callback.call(this, false, this._connection);
    }else{
        // create a new connection
        this.connect(callback, database);
    }
}
/**
 * Closing a database connection
 * @param database String, database name
 * @param callback function(e, connection)
 */
KMySqlDb.prototype.closeConnection = function(database, callback){
    var self = this;
    database = database || this.config.database;
    var uri = this.getURI(database);
    this.log.beginProfile(database);
    if (this._connections.hasOwnProperty(database)){
        this._connections[database].end(
            function(e){
                if (!e){
                    if (self._connections[database] == self._connection){
                        self._connection = null;
                    }
                    // delete a connection from an array
                    delete self._connections[database];
                    self._amount_conns--;
                    self.log.print("[-] [" + self.log.endProfile(database) + " sec.] Close mysql connection to '" + uri + "'");
                }else{
                    self.log.print("[!] Error closing mysql connection to '" + uri + "'", self.log.TYPE_ERROR);
                }
                if (typeof callback == "function"){
                    callback.call(self, e);
                }
            }
        );
    }else{
        self.log.print("[!] Error closing mysql connection. The connection by name " + database + " is not found!", self.log.TYPE_ERROR);
    }
}
/**
 * Closing all database connections
 * @param callback function(e)
 */
KMySqlDb.prototype.closeAllConnections = function(callback){
    for (var c in this._connections){
        this.closeConnection(c, function(e){
            if (!e){
                if (this._amount_conns == 0){
                    if (typeof callback == "function"){
                        callback.call(this, false);
                    }
                }
            }else{
                callback.call(this, e);
            }
        });
    }
}

/**
 * Closures of outdated connections
 */
KMySqlDb.prototype.closeOutConnections = function(){
    for (var c in this._connections){
        if (this._connections[c].rtime < new Date().getTime() - this.WAIT_TIMEOUT){
            this.closeConnection(c, function(e){
                if (!e){
                }else{
                }
            });
        }
    }
}

/**
 * Returns the name of the database under-utilized, then there is a connection that is less often used
 * @return String, database names
 */
KMySqlDb.prototype.getUdrlNameConnection = function(){
    var min = 1;
    var nc;
    var i = 0;
    // through all connections
    for (var c in this._connections){
        if (this._connections[c].used == 1){
            nc = c;
            break;
        }else{
            if (i == 0){
                nc = c;
            }else{
                if (min > this._connections[c].used){
                    min = this._connections[c].used;
                    nc = c;
                }
            }
        }
        i++;
    }
    return nc;
}

module.exports = KMySqlDb;