module.exports = {
    "dir_components": "components/",
    "components":{
        "WsServer": {
            "host": "localhost",
            "port": 1337
        },
        "KMySqlDb": {
            "max_connections": 50,
            "wait_timeout": 30
        },
        "KCacheSql": {
            // the time auto clear cache, sec., by default is set in 15 min.
            "time_clear": 60 * 15
        }
    },
    "dir_models": "models/"
}