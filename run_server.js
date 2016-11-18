const Server = require('./server/Server.js');

const sammulqueen_com = new Server(3333, "127.0.0.1");

sammulqueen_com.start();
