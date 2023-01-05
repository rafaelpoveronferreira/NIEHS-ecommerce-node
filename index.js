const express = require('express');
const app = express();

const cors = require('cors')
const corsOptions = require('./corsOptions')
app.use(cors(corsOptions))

const dotenv = require('dotenv');
dotenv.config();
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