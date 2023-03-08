const express = require("express")
const destinations = require("../app/controllers/destination.controller.js")
const verifyToken = require("../app/middlewares/auth.middleware")
const upload = require("../app/middlewares/upload.middleware")
const multer = require("multer")
const uploadexcel = multer({ dest: './src/public/upload/' })
const path = require("path")

const storage = multer.diskStorage({
  destination: "./src/public/upload",
  filename: function (req, file, cb) {
    let name = path.extname(file.originalname)
    cb(null, Date.now() + name);
  },
});
const diskStorage = multer({ storage: storage });


module.exports = function(app){
    const router = express.Router()
    router.get("/", destinations.findAll)
    router.get("/form/add", destinations.add)           //view
    router.get("/search/:slug", destinations.search)
    router.get("/edit/:id", destinations.edit)          //view
    router.post("/create", diskStorage.array("image"), destinations.create)         //server
    router.post("/create/excel", diskStorage.single("file"), destinations.create)         //server
    router.put("/update/:id", diskStorage.array("image"), destinations.update)      //server
    router.delete("/delete/:id", destinations.delete)
    router.post("/action", destinations.action)
    router.get("/filter/:districtID/:wardcode/:typeID/:serviceID", destinations.filter)
    router.get("/all", destinations.simpleFindAll)
    router.put("/save/:id", destinations.collect)
    router.put("/unsave/:id", destinations.uncollect)
    router.get("/favorite/:id", destinations.favorite)
    router.get("/:id", destinations.findOne)
//    router.get("*", (_, res) => res.render("notfound"))
    app.use("/destinations", router)
};