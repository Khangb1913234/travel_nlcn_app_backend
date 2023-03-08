const express = require("express")
const rating = require("../app/controllers/rating.controller.js")
const verifyToken = require("../app/middlewares/auth.middleware")

module.exports = function(app){
    const router = express.Router()
    router.post("/create", rating.create)
    //router.get("*", (_, res) => res.render("notfound"))
    app.use("/rating", router)
};