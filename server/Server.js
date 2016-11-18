const Events = require("../lib/Events.js");
const fs = require('fs');

const Server = function(port, hostname){
    const server = this;
    server.events = new Events();
    // Load all listeners from /server/listeners folder
    const path = "./listeners"
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
    server.loadListeners = function(){
      server.events.listeners = [];
      loadListenersFolder("./listeners");
    }
}

module.exports = Server;
