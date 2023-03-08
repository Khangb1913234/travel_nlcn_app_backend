const express = require("express")
const types = require("../app/controllers/type.controller.js")
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
    router.get("/form/add", types.add)
    router.post("/create", upload.single("file"), types.create)
    router.get("/edit/:id", types.edit)                                //view
    router.put("/update/:id", types.update)                            //server
    router.delete("/delete/:id", types.delete)
    router.post("/action", types.action)
    // router.get("*", (_, res) => res.render("notfound"))
    app.use("/types", router)
};