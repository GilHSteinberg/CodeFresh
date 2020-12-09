const fs = require("fs");
const Docker = require("dockerode");

const subscribe = (container) => {
  container.attach({stream: true, stdout: true, stderr: true, logs: true}, (err, stream) => {
    if (err) {
      console.log("an error");
    }
    else{
      stream.on('data', (chunk) => {
        if(err){
          console.log("error occurred while accessing container (${current.dockerId}) - will inspect");
        }//considerPipe
        updateLog(container.name, chunk);
      });//data.on
    }
  });
}

const SubscribeByLabel = function(docker, label){
  
  let listOpts = {
    "filters": `{\"label\": [\"mylabel=${label}\"]}`
  };
  
  docker.listContainers(listOpts, (err, containers) => {
    if(err){
      console.log("an err");
    }
    
    containers.forEach((container) => subscribe(container));
  });
}

function updateLog(id, data) {
  const path = `logs/log_${id}.txt`;
  fs.appendFile(path, data, (err) => {
    if (err) console.log(err);
  })
};

module.exports = SubscribeByLabel;




