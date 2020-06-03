// Smart hotel project!

// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }
require('dotenv').config()
const fs = require('fs')
const flash = require('express-flash')
const mongodb = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => user.find(user => user.email === email),
    id => user.find(user => user.id === id)
)
// keep user data instead of database
// WARNING: this procedure copy all data to array, beware data overflow!

var user = []

const cors = require('cors')
const app = express()

app.use(cors())
app.set('view-engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // should we resave session variable if nothing has changed?
    saveUninitialized: false, // do you want to save an empty value in the session if there is no value?
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var mongo_client = mongodb.MongoClient
var db



// : Database Connection
mongo_client.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error, connection) {
    if (error) {
        console.error(error)
    } else {
        console.log("Database: connected!")
        db = connection.db("Hotel_Energy_Saving");
        // prepare user data
        db.collection('technician').find({})
            .toArray(function (err, result) {
                user = result.map(r => {
                    return {
                        id: r.technicianID,
                        firstName: r.firstName,
                        lastName: r.lastName,
                        nationality: r.nationality,
                        status: r.status,
                        email: r.email,
                        password: r.password,
                    }
                })
            });
    }
})

// : Client - Static web pages
app.get('/index', (req, res) => {
    res.render('index.ejs')
})

app.get('/user', (req, res) => {
    res.render('user.ejs', { name: "Jane Tapscott" })
})

app.get('/userTechnician', (req, res) => {
    try {
        res.render('userTechnician.ejs', { name: `${req.user.firstName} ${req.user.lastName}` })
    }
    catch (e) {
        res.render('login.ejs', { message: "You need to log in first!" })
    }
})


app.get('/dashboard', (req, res) => {
    //// Latest power consumption (single)
    db.collection('power').find({}).limit(1).sort({ $natural: -1 })
        .toArray(function (err, result) {
            const data = result.map(r => {
                return {
                    Timestamp: r.timestamp,
                    Air: r.air.toFixed(2),
                    Light: r.light.toFixed(2),
                    Outlet: r.outlet.toFixed(2),
                    HotelCost: r.hotelCost.toFixed(2),
                    RemindCost: r.remindCost.toFixed(2),
                    UsageAir: r.usageAir.toFixed(2),
                    UsageLight: r.usageLight.toFixed(2),
                    UsageOutlet: r.usageOutlet.toFixed(2)
                }
            })
            res.render('dashboard.ejs', { data: data, name: "Jane Tapscott" })
        });
})

app.get('/dashboardTechnician', (req, res) => {
    // // Latest power consumption (single)
    db.collection('power').find({}).limit(1).sort({ $natural: -1 })
        .toArray(function (err, result) {
            const data = result.map(r => {
                return {
                    Timestamp: r.timestamp,
                    Air: r.air.toFixed(2), // convert Watt to kw
                    Light: r.light.toFixed(2),
                    Outlet: r.outlet.toFixed(2),
                    HotelCost: r.hotelCost.toFixed(2),
                    RemindCost: r.remindCost.toFixed(2),
                    UsageAir: r.usageAir.toFixed(2),
                    UsageLight: r.usageLight.toFixed(2),
                    UsageOutlet: r.usageOutlet.toFixed(2)
                }
            })
            try {
                res.render('dashboardTechnician.ejs', { data: data, name: `${req.user.firstName} ${req.user.lastName}` })
            }
            catch (e) {
                res.render('login.ejs', { message: "You need to log in first!" })
            }
        });

})

app.get('/charts/:time', function (req, res) {
    // practical
    // 1 min = 60 sec = 6 sec/interval = 1 document for distance = query limit 19 -> get the number from index 0, 2, 4, 6, 8, 10, 12, 14, 16, 18
    // 5 min = 300 sec = 30 sec/interval = 10 document for distance = query limit 100 -> get the number from index 0, 11, 22, 33, 44, 55, 66, 77, 88, 99
    // 30 min = 1800 sec = 180 sec/interval = 68 document for distance = query limit 613 -> get the number from index 0, 68, 136, 204, 272, 340, 408, 476, 544, 612
    // 1 hr(60 min) = 3600 sec = 360 sec/interval = 136 document for distance = query limit 1216 -> get the number from index 0, 135, 270, 405, 540, 675, 810, 945, 1080, 1215
    // 1 day(1440 min) = 86400 sec = 8640 sec/interval (2hrs. 24 min) = 3174 document for distance = query limit 28567 -> get the number from index 0, 3174, 6348, 9522, 12696, 15870, 19044, 22218, 25392, 28566

    var limitDoc, index
    var time = parseInt(req.params.time)
    var resolution
    if (time == "60") { limitDoc = 19; index = 2; resolution = "1 min" } // 1 min
    else if (time == "300") { limitDoc = 100; index = 11; resolution = "5 mins" } // 5 mins
    else if (time == "1800") { limitDoc = 613; index = 68; resolution = "30 mins" } // 30 mins
    else if (time == "3600") { limitDoc = 1216; index = 135; resolution = "1 hr" } // 1 hr
    else if (time == "86400") { limitDoc = 28567; index = 3174; resolution = "1 day" } // 1day
    else { limitDoc = 10; index = 1; time = "1"; resolution = "Real-time" }

    time = parseInt(time) * 1000; // parseInt later to prevent non-integer request parameter from user

    db.collection('power').find({}).limit(limitDoc).sort({ _id: -1 })
        .toArray(function (err, result) {

            var cleanData = []
            var data = result.map(r => {
                return {
                    Timestamp: r.timestamp,
                    Air: r.air,
                    Light: r.light.toFixed(2),
                    Outlet: r.outlet.toFixed(2)
                }
            })

            for (var i = 0; i < data.length; i++) {
                if (i % index == 0) {
                    cleanData.push(data[i])
                }
            }

            try {
                res.render('charts.ejs', {
                    data: cleanData,
                    name: `5305`,
                    time: time,
                    resolution: resolution
                })
            }
            catch (e) {
                console.log(e)
                res.render('login.ejs', { message: "You need to log in first!" })
            }
        });
})

app.get('/chartsTechnician/:time', function (req, res) {
    // practical
    // 1 min = 60 sec = 6 sec/interval = 1 document for distance = query limit 19 -> get the number from index 0, 2, 4, 6, 8, 10, 12, 14, 16, 18
    // 5 min = 300 sec = 30 sec/interval = 10 document for distance = query limit 100 -> get the number from index 0, 11, 22, 33, 44, 55, 66, 77, 88, 99
    // 30 min = 1800 sec = 180 sec/interval = 68 document for distance = query limit 613 -> get the number from index 0, 68, 136, 204, 272, 340, 408, 476, 544, 612
    // 1 hr(60 min) = 3600 sec = 360 sec/interval = 136 document for distance = query limit 1216 -> get the number from index 0, 135, 270, 405, 540, 675, 810, 945, 1080, 1215
    // 1 day(1440 min) = 86400 sec = 8640 sec/interval (2hrs. 24 min) = 3174 document for distance = query limit 28567 -> get the number from index 0, 3174, 6348, 9522, 12696, 15870, 19044, 22218, 25392, 28566

    var limitDoc, index
    var time = parseInt(req.params.time)
    var resolution
    if (time == "60") { limitDoc = 19; index = 2; resolution = "1 min" } // 1 min
    else if (time == "300") { limitDoc = 100; index = 11; resolution = "5 mins" } // 5 mins
    else if (time == "1800") { limitDoc = 613; index = 68; resolution = "30 mins" } // 30 mins
    else if (time == "3600") { limitDoc = 1216; index = 135; resolution = "1 hr" } // 1 hr
    else if (time == "86400") { limitDoc = 28567; index = 3174; resolution = "1 day" } // 1day
    else { limitDoc = 10; index = 1; time = "1"; resolution = "Real-time" }

    time = parseInt(time) * 1000; // parseInt later to prevent non-integer request parameter from user

    db.collection('power').find({}).limit(limitDoc).sort({ _id: -1 })
        .toArray(function (err, result) {

            var cleanData = []
            var data = result.map(r => {
                return {
                    Timestamp: r.timestamp,
                    Air: r.air,
                    Light: r.light.toFixed(2),
                    Outlet: r.outlet.toFixed(2)
                }
            })

            for (var i = 0; i < data.length; i++) {
                if (i % index == 0) {
                    cleanData.push(data[i])
                }
            }

            try {
                res.render('chartsTechnician.ejs', {
                    data: cleanData,
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    time: time,
                    resolution: resolution
                })
            }
            catch (e) {
                console.log(e)
                res.render('login.ejs', { message: "You need to log in first!" })
            }
        });
})

app.get('/calendar', function (req, res) {
    db.collection('calendar').find({})
        .toArray(function (err, result) {
            const data = result.map(r => {
                return {
                    Title: r.title,
                    Start: Date.parse(r.start),
                    End: Date.parse(r.end),
                    ClassName: r.className
                }
            })
            try {
                res.render('calendar.ejs', { data: data, name: `${req.user.firstName} ${req.user.lastName}` })
            }
            catch (e) {
                res.render('login.ejs', { message: "You need to log in first!" })
            }
        });
})

app.get('/nationality', (req, res) => {
    try {
        res.render('nationality.ejs', { name: `${req.user.firstName} ${req.user.lastName}` })
    }
    catch (e) {
        res.render('login.ejs', { message: "You need to log in first!" })
    }
})

app.get('/login', (req, res) => {
    res.render('login.ejs', { message: "" })
})

// : API - Send data to clients
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboardTechnician',
    failureRedirect: '/fail',
    failureFlash: true
}))

app.get('/fail', (req, res) => {
    res.render('login.ejs', { message: "Your email or password is incorrect!" })
})

app.get('/api/insertCalendar/:eventData', (req, res) => {
    var eventData = JSON.parse(req.params.eventData)
    eventData.className = "bg-info"

    db.collection('calendar').insertOne(eventData, (err, result) => {
        if (err) throw err;
    })
    //res.render('/calendar.ejs', { name: `${req.user.firstName} ${req.user.lastName}` })
})

app.get('/api/getValue/:value', (req, res) => {
    var date = new Date() + new Date().getTimezoneOffset()
    var payload = req.params.value
    payload = payload.split(',')

    var dataPower = {
        timestamp: date,
        air: parseFloat(payload[0]),
        outlet: parseFloat(payload[1]),
        light: parseFloat(payload[2]),
        totalkWh: parseFloat(payload[3]),
        hotelCost: parseFloat(payload[6]),
        remindCost: parseFloat(payload[7]),
        usageAir: parseFloat(payload[8]),
        usageLight: parseFloat(payload[9]),
        usageOutlet: parseFloat(payload[10])
    }
    console.log(dataPower)
    db.collection('power').insertOne(dataPower, (err, result) => {
        if (err) throw err;
    })
    res.render('test.ejs', { message: req.params.value })
})

app.get('/api/dashboardUpdate', (req, res) => {
    //// Latest power consumption (single)
    db.collection('power').find({}).limit(1).sort({ $natural: -1 })
        .toArray(function (err, result) {
            const data = result.map(r => {
                return {
                    Timestamp: r.timestamp,
                    Air: r.air.toFixed(2), // convert Watt to kw
                    Light: r.light.toFixed(2),
                    Outlet: r.outlet.toFixed(2),
                    HotelCost: r.hotelCost.toFixed(2),
                    RemindCost: r.remindCost.toFixed(2),
                    UsageAir: r.usageAir.toFixed(2),
                    UsageLight: r.usageLight.toFixed(2),
                    UsageOutlet: r.usageOutlet.toFixed(2)
                }
            })
            res.send(data)
        });
})


app.get('/api/chartsUpdate/:time', (req, res) => {
    // ideal : get current time, query with the minutes end with 0 or 5, 10 values
    // var date = new Date - new Date() + new Date().getTimezoneOffset()
    // var minute = date.getMinutes() % 10

    // practical
    // 1 min = 60 sec = 6 sec/interval = 1 document for distance = query limit 19 -> get the number from index 0, 2, 4, 6, 8, 10, 12, 14, 16, 18
    // 5 min = 300 sec = 30 sec/interval = 10 document for distance = query limit 100 -> get the number from index 0, 11, 22, 33, 44, 55, 66, 77, 88, 99
    // 30 min = 1800 sec = 180 sec/interval = 68 document for distance = query limit 613 -> get the number from index 0, 68, 136, 204, 272, 340, 408, 476, 544, 612
    // 1 hr(60 min) = 3600 sec = 360 sec/interval = 136 document for distance = query limit 1216 -> get the number from index 0, 135, 270, 405, 540, 675, 810, 945, 1080, 1215
    // 1 day(1440 min) = 86400 sec = 8640 sec/interval (2hrs. 24 min) = 3174 document for distance = query limit 28567 -> get the number from index 0, 3174, 6348, 9522, 12696, 15870, 19044, 22218, 25392, 28566

    var limitDoc, index
    if (req.params.time == "60") { limitDoc = 19; index = 2 } // 1 min
    else if (req.params.time == "300") { limitDoc = 100; index = 11 } // 5 mins
    else if (req.params.time == "1800") { limitDoc = 613; index = 68 } // 30 mins
    else if (req.params.time == "3600") { limitDoc = 1216; index = 135 } // 1 hr
    else if (req.params.time == "86400") { limitDoc = 28567; index = 3174 } // 1day
    else { limitDoc = 10; index = 1 }

    db.collection('power').find({}).limit(limitDoc).sort({ _id: -1 })
        .toArray(function (err, result) {

            var cleanData = []
            var data = result.map(r => {
                return {
                    Timestamp: r.timestamp,
                    Air: r.air,
                    Light: r.light.toFixed(2),
                    Outlet: r.outlet.toFixed(2)
                }
            })

            for (var i = 0; i < data.length; i++) {
                if (i % index == 0) {
                    cleanData.push(data[i])
                }
            }

            try {
                res.send(cleanData)
            }
            catch (e) {
                res.send(e)
            }
        });
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/index')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server start on port ${PORT}`))