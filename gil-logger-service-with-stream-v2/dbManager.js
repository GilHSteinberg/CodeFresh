const low = require("lowdb");//the db I'll be using
const lodashId = require("lodash-id"); //adds useful funcs to lowdb
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");//this is how we'll be writing to our db

const fs = require("fs");
const Docker = require("dockerode");

const ip = "0.0.0.0";
const port = 8888;
const serverDocker = new Docker(ip, port);

const ProcessContainer = function(db){
    let newEntries = db
      .get('containers')
      .filter({timeKey: 0})
      .value();
    console.log("hey");
    newEntries.forEach((entry) => entry.processed = true);
}

module.exports = ProcessContainer;
    
    
    
    
    