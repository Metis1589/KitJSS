// inheritance
new (require("./KExClass"))().extend(KApp, require("./KBase"));
/**
 * The base class server application
 * @extends KBase
 * @constructor
 */
function KApp(){
    KApp.super.constructor.apply(this, arguments);
    this._config = {};
}
/**
 * Pattern configuration
 */
var Config = {
    /**
     * Directory to the components
     */
    "dir_components": String + "/",
    /**
     * The list components
     */
    "components":{
        "WsServer": {
            "class": String, // if components is inheritance, then indicated path to user component
            "host": String,
            "port": Number
        },
        "KMySqlDb": {
            "class": String, // too
            "host": String,
            "user": String,
            "password": String,
            "database": String,
            /**
             * max connections to DB. If the number connections more max connections and cache is on then
             * connection which less commonly used will be closed and create new connection
             */
            "max_connections": Number
        },
        "KCacheSql": {
            // the time auto clear cache, sec., by default is set in 15 min.
            "time_clear": Number
        }
    },
    /**
     * Directory to the models
     */
    "dir_models": String + "/",
    /**
     * The list models
     */
    "models":[
        String | {String: {}}
    ]
};
/**
 * The init WebSocket server
 * @param config {Config}, configuration
 */
KApp.prototype.init = function(config){
    this.log.add("Read configuration app.");
    this.log.add("Merge configurations.");
    // merge configuration
    config = this.mergeConfig(config, require("../config"));
    this._config = config;
    //...
    this.initComponents();
    this.initModels();
}
/**
 * Include components
 */
KApp.prototype.initComponents = function(){
    if (typeof this._config.dir_components != "undefined"){
        this.log.add("Init components.");
        var def_dir_components = "../components/";
        var dir_components = this._config.dir_components || def_dir_components;
        var component;
        // components with config
        for (var nc in this._config.components){
            component = this._config.components[nc];
            if ((typeof component.class == "undefined") || !component.class){
                this.log.add("\t+ d[" + nc + "]\t" + JSON.stringify(component));
                // default component
                global[nc] = new (require(def_dir_components + nc))(component);
            }else{
                this.log.add("\t+ u[" + nc + "]\t" + JSON.stringify(component));
                // user component
                global[nc] = new (require("../../" + dir_components + component.class))(component);
            }
        }
    }
}
/**
 * Include models
 */
KApp.prototype.initModels = function(){
    if (typeof this._config.models != "undefined"){
        this.log.add("Init models.");
        var dir_models = "../../" + this._config.dir_models || "models/";
        this.includeClasses(dir_models, this._config.models);
    }
}
/**
 * Include a few classes
 * @param dir String, directory to the classes
 * @param classes [], array classes
 */
KApp.prototype.includeClasses = function(dir, classes){
    // models with config
    for (var i in classes){
        this.includeClass(dir, classes[i]);
    }
}
/**
 * Include class
 * @param dir String, directory to the class
 * @param _class String|{}, name class or object class
 */
KApp.prototype.includeClass = function(dir, _class){
    if (typeof _class == "object"){
        for (var p in _class){
            this.log.add("\t+ [" + p + "]\t" + JSON.stringify(_class[p]));
            // transfer additional parameters in the model
            this.include(dir, p, _class[p]);
        }
    }else{
        this.log.add("\t+ [" + _class + "]");
        this.include(dir, _class, {});
    }
}
/**
 * Include class
 * @param name String, name class
 * @param dir String, directory to the class
 * @param arguments {}, arguments
 */
KApp.prototype.include = function(dir, name, arguments){
    global[name] = new (require(dir + name))(arguments);
}
/**
 * The merge default with user configuration
 * @param receiver {}, user config
 * @param source {}, default config
 */
KApp.prototype.mergeConfig = function(receiver, source){
    if (typeof receiver != "undefined"){
        for (var p in source){
            if (!receiver.hasOwnProperty(p)){
                this.log.add("\t\t+ [" + p + "]");
                receiver[p] = source[p];
            }else if (typeof source[p] == "object"){
                this.log.add("\t" + p);
                this.mergeConfig(receiver[p], source[p]);
            }
        }
        return receiver;
    }else{
        return source;
    }
}
module.exports = KApp;