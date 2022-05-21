require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const app = express()
const PORT = process.env.PORT
const cloudinary = require('cloudinary').v2
const cookieParser = require('cookie-parser')
const swaggerUi = require("swagger-ui-express");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
require('dotenv').config()
app.use((req, res, next) => {
    cors({
        origin: req.headers.origin
    })
    console.log(req.headers.origin);
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Headers', ' X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
    res.header('Access-Control-Allow-Credentials', true)
    next()
})
app.use(bodyParser.json({ limit: '200mb' }));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(cookieParser({ overwrite: true }))


app.use('/user', require('./routes/user'))


// documentation
const swaggerDocs = require("./swagger.json");
app.use(
    "/documentation",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, false, {
        docExpansion: "none",
    })
);


app.get('/', async (req, res) => {
    return res.status(200).json({ message: "WELCOME TO MTUNES" })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} successfull`)
})
// const URL = process.env.OFFLINE_URL
const URL = process.env.ONLINE_CLUSTER_URL
const dbConnection = async () => {
    mongoose.connect(URL, (err) => {
        if (err) { console.log(err); }
        else { console.log('Connected to database'); }
    })
}
dbConnection()

