var express = require("express");
var router = express.Router();
const qs = require('qs'); //qs.parse(),
const Docker = require('dockerode');
const fs = require('fs');

module.exports = function (db) {
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
                newContainer.subbed = false;
                newContainer.logger = "";
                res.send(db.get("containers").insert(newContainer).write());
            }
        });

    router.route("/containers/:dockerId")
        .delete((req, res) => {
            const fetchedItem = db.get("containers").find({dockerId: req.params.dockerId}).value();

            if(fetchedItem){
                db.get("containers").remove({dockerId: req.params.dockerId}).write();
                res.status(204).send();
            }
            else{
                res.status(404).send();
            }
        })
        .patch((req, res) => {
            res.send(
                db.get("containers").find({dockerId: req.params.dockerId}).assign(req.body).write());
        })
        .get((req, res) => {
            const fetchedItem = db.get("containers").find({dockerId: req.params.dockerId}).value();
            const path = `./logs/log_${fetchedItem.dockerId}.txt`;
            fetchedItem.logger = fs.readFileSync(path, 'utf8');

            if(fetchedItem){
                res.send(fetchedItem);
            }
            else{
                res.status(404).send();
            }
        });
    return router;

};
