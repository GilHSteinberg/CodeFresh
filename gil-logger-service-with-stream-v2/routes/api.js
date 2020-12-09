const express = require("express");
const router = express.Router();
const containersRouter = require("./containers");

module.exports = function (db) {
  router.use(containersRouter.Main(db));

  return router;
};
