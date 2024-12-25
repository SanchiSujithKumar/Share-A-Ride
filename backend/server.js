const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();
app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
dotenv.config();

connectDB();

const store = new MongoDBSession({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
});

app.use(
    session({
    secret:"secretcode",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 
    },
    })
);

app.use("/user", require("./routes/userRoutes"));

app.use("/ride", require("./routes/rideRoutes"));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app;
