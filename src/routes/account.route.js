const express = require("express")
const accounts = require("../app/controllers/account.controller")

module.exports = function(app){
    const router = express.Router()
    router.post("/register", accounts.register)
    router.post("/login", accounts.login)
    router.put("/update/:id", accounts.update)   
    router.delete("/delete/:id", accounts.delete)
    router.post("/action", accounts.action)
    router.get("/detail", accounts.detail)
    app.use("/account", router)
};