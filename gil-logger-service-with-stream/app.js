var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const low = require("lowdb");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

db._.mixin(lodashId);
db.defaults({ containers: [] });
var UpdateRouter = express.Router();
var apiRouter = require("./routes/api")(db);
var clientRouter = require("./routes/client");
const fs = require("fs");
const Docker = require("dockerode");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(clientRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send();
});


const SubToLogs = function SubToUnsubbed() {

  let dbContent = db.get('containers')
      .filter({subbed: false})
      .sortBy('dockerIp')
      .value()

  for (let i = 0; i < dbContent.length; ++i) {

    let docker = new Docker(dbContent[i].dockerIp, dbContent[i].dockerPort);

    if (!docker) {
      continue;
    }

    for (let currentDockerIp = dbContent[i].dockerIp;
         i < dbContent.length && dbContent[i].dockerIp === currentDockerIp; currentDockerIp = dbContent[i].dockerIp , ++i) {
      let current = dbContent[i];
      let container = null;

      container = docker.getContainer(dbContent[i].dockerId);

      if (container) {
        current.subbed = true;
        container.attach({stream: true, stdout: true, stderr: true, logs: true}, (err, data) => {
          if (err) {
            switch (err.statusCode) {
              case 404:
                db.get('containers')
                    .remove({id: current.id})
                    .write();
                console.log(`bad container id detected (${current.dockerId}). will remove`);
                break;
              default:
                console.log(err);
                break;
            }
          }
          if(data)
          {
            data.on('data', (chunk) => {
              if(err){
                console.log("an error occurred while accessing container (${current.dockerId}) - will inspect");
              }
              updateLog(current.dockerId, chunk);
            });

            data.on('stop', () => {
              container.inspect(current, (data) => {
                if (data.State.Running !== true) {
                  db.get('containers')
                      .remove({id: current.id})
                      .write();
                  console.log(`stopped container detected (${current.dockerId}). Removing from db`);
                }
              });
            });
          }
        });
      }
    }
  }
}

const InspectContainers = function() {

  let dbContent = db.get('containers')
      .sortBy('dockerIp')
      .value();

  for (let i = 0; i < dbContent.length; ++i) {

    let docker = new Docker(dbContent[i].dockerIp, dbContent[i].dockerPort);

    if (!docker) {
      continue;
    }

    for (let currentDockerIp = dbContent[i].dockerIp;
         i < dbContent.length && dbContent[i].dockerIp === currentDockerIp; currentDockerIp = dbContent[i].dockerIp , ++i) {
      let current = dbContent[i];
      let container = null;

      container = docker.getContainer(dbContent[i].dockerId);

      container.inspect(0, (err, data) => {
        if (err) {
          switch (err.statusCode) {
            case 404:
              db.get('containers')
                  .remove({id: current.id})
                  .write();
              console.log(`bad container id detected (${current.dockerId}). Removing from db`);
              break;
            default:
              console.log(err);
              break;
          }
        } else {
          if (data.State.Running !== true) {
            db.get('containers')
                .remove({id: current.id})
                .write();
            console.log(`stopped container detected (${current.dockerId}). Removing from db`);
          }
        }
      });
    }
  }
}

function updateLog(id, data) {
  const path = `logs/log_${id}.txt`;
  fs.appendFile(path, data, (err) => {
    if (err) console.log(err);
  })
};

const timerforLogs = setInterval(SubToLogs, 10 * 1000);
const timerforInspect = setInterval(InspectContainers, 50 * 1000);

module.exports = app;





