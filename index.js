const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

// Helmet middleware
const helmet = require("helmet");
app.use(helmet());

// CORS middleware
//const cors = require('cors')
//const corsOptions = require('./corsOptions')
//app.use(cors(corsOptions))
const WHITELIST = [
    '3.18.12.63',
    '3.130.192.231',
    '13.235.14.237',
    '13.235.122.149',
    '18.211.135.69',
    '35.154.171.200',
    '52.15.183.38',
    '54.88.130.119',
    '54.88.130.237',
    '54.187.174.169',
    '54.187.205.235',
    '54.187.216.72',
    'https://rafaelpoveronferreira.github.io/NIEHS-ecommerce-react',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
    'http://localhost:4174']

app.use((req, res,next) => {
    console.log(req.headers.origin)
    res.header("Access-Control-Allow-Origin", WHITELIST.some(e=>e.includes(req.headers.origin))?req.headers.origin:false)
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Headers", "content-type")
    next()
})


const mongoose = require('mongoose');

var cookies = require("cookie-parser");

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user');
const productRoute = require('./routes/product')
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');

mongoose.connect(process.env.MONGO_URI)
.then(console.log('MongoDB connected'))
.catch(err=>console.log(err));

app.use(express.json());


app.use(cookies());

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/order', orderRoute);
app.use('/stripe', stripeRoute)

var listener = app.listen(process.env.PORT || 5000, () => console.log('backend is running on port '+listener.address().port));