const Events = require("./Events.js");

const Server = function(port, hostname){
    const server = this;
    server.events = new Events();
}

module.exports = Server;
