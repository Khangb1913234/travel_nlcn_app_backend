const express = require("express")
const services = require("../app/controllers/service.controller.js")
const verifyToken = require("../app/middlewares/auth.middleware")

const multer  = require('multer')
const path = require("path")

const storage = multer.diskStorage({
    destination: "./src/public/upload",
    filename: function (req, file, cb) {
        let name = path.extname(file.originalname)
        cb(null, Date.now() + name);
    },
});
const upload = multer({ storage: storage });

module.exports = function(app){
    const router = express.Router()
    router.get("/form/add", services.add)
    router.post("/create", upload.single("file"), services.create)
    router.get("/edit/:id", services.edit)                                //view
    router.put("/update/:id", services.update)                            //server
    router.delete("/delete/:id", services.delete)
    router.post("/action", services.action)
    // router.get("*", (_, res) => res.render("notfound"))
    app.use("/services", router)
};