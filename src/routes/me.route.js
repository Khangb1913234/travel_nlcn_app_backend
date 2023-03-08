const express = require("express")
const me = require("../app/controllers/me.controller.js")
const verifyToken = require("../app/middlewares/auth.middleware")

module.exports = function(app){
    const router = express.Router()
    router.get("/stored/accounts", me.findAllAccount)
    router.get("/stored/approvals/:opt", me.findAllApproval)
    router.get("/stored/notdestinations", me.findAllNotDes)
    router.get("/stored/nottours", me.findAllNotTour)
    router.get("/stored/destinations", me.findAllDestination)
    router.get("/stored/tours", me.findAllTour)
    router.get("/stored/types", me.findAllType)
    router.get("/stored/services", me.findAllService)
    // router.get("*", (_, res) => res.render("notfound"))
    app.use("/me", router)
};