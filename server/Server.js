const Events = require("../lib/Events.js");
const fs = require('fs');

const Server = function(port, hostname){
    const server = this;
    server.events = new Events();

    server.port = port;
    server.hostname = hostname;

    // Load all listeners from /server/listeners folder
    server.loadListeners = function(){
      function loadListenersFolder(path){
        fs.readdir(path, function(err, files){
          if(!err){
            for(var f=0;f<files.length;f++){
              if(files[f].indexOf(".")<0){
                // Directory
                loadListenersFolder(path+"/"+files[f]);
              }else if(files[f].indexOf(".json")>-1||files[f].indexOf(".js")>-1){
                server.events.listeners = server.events.listeners.concat(require(path+"/"+files[f]));
              }
            }
          }
        });
      }
      server.events.listeners = [];
      loadListenersFolder("./listeners");
    }
    server.start = function(){
      server.loadListeners();
      server.events.emit.call(server, "start", server);
    }
}

module.exports = Server;
