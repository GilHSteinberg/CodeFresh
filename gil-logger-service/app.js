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


const updater = function updateAll() {

  let data = db.get('containers')
      .sortBy('dockerIp')
      .value()

  for (let i = 0; i < data.length; ++i) {

    let docker = new Docker(data[i].dockerIp, data[i].dockerPort);

    if (!docker) {
      continue;
    }

    for (let currentDockerIp = data[i].dockerIp;
         i < data.length && data[i].dockerIp === currentDockerIp; currentDockerIp = data[i].dockerIp , ++i) {

      let logOpts = {
        stdout: true,
        stderr: true,
        follow: false,
        timestamps: true,
        since: data[i].lastLogTime,
        data: data[i]
      };

      let container = null;

      container = docker.getContainer(data[i].dockerId);

      if (container) {

        container.attach({stream: true, stdout: true, stderr: true, logs: true}, (err, data) => {
          if (err) {
            console.log("there was a problem with the container - will be inspected");
          }
        });
      }

      container.logs(logOpts, (err, data) => {
        if (err) {
          console.log("there was a problem with the container - will be inspected");
        }
        else {
          let current = logOpts.data;
          updateLog(logOpts.data.dockerId, data);
          current.lastLogTime = Math.floor(+new Date() / 1000);
        }
      });

      container.inspect(logOpts, (err, data) => {
        if (err) {
          switch (err.statusCode) {
            case 404:
              db.get('containers')
                  .remove({id: logOpts.data.id})
                  .write();
              console.log(`bad container id detected (${logOpts.data.dockerId}). Removing from db`);
              break;
            default:
              console.log(err);
              break;
          }
        }
        else {
          if (data.State.Running !== true) {
            db.get('containers')
                .remove({id: logOpts.data.id})
                .write();
            console.log(`stopped container detected (${logOpts.data.dockerId}). Removing from db`);
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

const timer = setInterval(updater, 10 * 1000);

module.exports = app;




