const express = require("express")
const path = require("path")
const cors = require('cors')
const paypal = require("paypal-rest-sdk")
// const methodOverride = require('method-override')
const app = express()
const PORT = 5000

const setupHomePageRoutes = require("./routes/home_page.route")
const setupDestinationRoutes = require("./routes/destinations.route")
const setupMeRoutes = require("./routes/me.route")
const setupTourRoutes = require("./routes/tour.route")
const setupRatingRoutes = require("./routes/rating.route")
const setupTypeRoutes = require("./routes/type.route")
const setupServiceRoutes = require("./routes/service.route")
const setupApprovalRoutes = require("./routes/approval.route")
const setupAccountRoutes = require("./routes/account.route")
const setupVillageRoutes = require("./routes/village.route")
const db = require("./config/db")

db.connect()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// app.use((_, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

// app.use(methodOverride('_method'))

setupAccountRoutes(app)
setupDestinationRoutes(app)
setupMeRoutes(app)
setupTourRoutes(app)
setupVillageRoutes(app)
setupRatingRoutes(app)
setupTypeRoutes(app)
setupApprovalRoutes(app)
setupServiceRoutes(app)
setupHomePageRoutes(app)

app.listen(PORT, function(){
    console.log(`Runing at: http://localhost:${PORT}`)
})
