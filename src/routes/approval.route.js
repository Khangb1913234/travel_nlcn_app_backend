const express = require("express")
const approval = require("../app/controllers/approval.controller.js")

module.exports = function(app){
    const router = express.Router()
    router.post("/create", approval.create)
    router.delete("/delete/:id", approval.delete)
    router.post("/action", approval.actionDelete)
    // router.get("*", (_, res) => res.render("notfound"))
    app.use("/approvals", router)
};