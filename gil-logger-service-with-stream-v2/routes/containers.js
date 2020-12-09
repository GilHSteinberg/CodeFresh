
const EventEmitter = require('events').EventEmitter;
var express = require("express");
var router = express.Router();
const qs = require('qs'); //qs.parse(),
const Docker = require('dockerode');
const fs = require('fs');
const ContainerManager = require('../dbManager.js');

const newContainerNotifier = new EventEmitter();
exports.newContainerNotifier = newContainerNotifier;

exports.Main = function (db) {
    router.route("/containers/:dockerId")
        .get((req, res) => {

            const fetchedItem = db.get("containers").find({dockerId: req.params.dockerId}).value();

            if(fetchedItem){

                const path = `./logs/log_${fetchedItem.dockerId}.txt`;
                fetchedItem.logger = fs.readFileSync(path, 'utf8');

                res.send(fetchedItem);
            }
            else{
                res.status(404).send();
            }
        })
        .delete((req, res) => {
            const fetchedItem = db.get("containers").find({dockerId: req.params.dockerId}).value();

            if(fetchedItem){
                db.get("containers").remove({dockerId: req.params.dockerId}).write();
                res.status(204).send();
            }
            else{
                res.status(404).send();
            }
        });

    router.route("/containers")
        .get((req, res) => {
            res.send(db.get("containers").value());
        })

        .post( (req, res) => {
            const newContainer = req.body;

            //╔═══════════════════════   data validation   ══════════════════════════╗
            const errors = [];
            let error_occurred = false;

            if (!newContainer.name){
                error_occurred = true;
                errors.push({
                    field: "name",
                    error: "required",
                    message: "You must enter a name"
                })
            }

            if (!newContainer.dockerId)
            {
                error_occurred = true;
                console.log("asfdasdsaasd");
                errors.push({
                    field: "dockerId",
                    error: "required",
                    message: "You must enter an id"
                })

            }else if (newContainer.dockerId.length !== 12)
            {
                error_occurred = true;
                errors.push({
                    field: "dockerId",
                    error: "bad length",
                    message: "You must enter a valid id"
                })
            }

            if (!newContainer.dockerIp){
                error_occurred = true;
                errors.push({
                    field: "dockerIp",
                    error: "required",
                    message: "You must enter an ip"
                })
            }

            if (!newContainer.dockerPort){
                error_occurred = true;
                errors.push({
                    field: "dockerPort",
                    error: "required",
                    message: "You must enter a port"
                })
            }

            if (newContainer.dockerPort && isNaN(Number(newContainer.dockerPort))){
                error_occurred = true;
                errors.push({
                    field: "dockerPort",
                    error: "type",
                    message: "Port num must be a number"
                })
            }
            //╚════════════════════════   data validation   ══════════════════════════╝

            if(error_occurred){
                res.status(422).send(errors);
            }

            else{
                newContainer.timeKey = 0;
                newContainer.logger = "";
                newContainerNotifier.emit('new');
                res.send(db.get("containers").insert(newContainer).write());
            }
        })
        .patch((req, res) => {
            let newData = req.body;
            newData.LastUpdate = Date.now();
            newData.label = newData.label.toString().split(":");
            newContainerNotifier.emit('newLabel', newData.label[1]);
            res.send(db.get("config").assign(newData).write());
        });


    return router;

};
