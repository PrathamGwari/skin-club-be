require('dotenv').config()
const db = require('./db/index');
const axios = require("axios");
const mongoose = require("mongoose");
const path = require('path');
const express = require('express');
const userRouter = require('./routes/user');
const indexRouter = require('./routes/booking');
const paymentRouter = require('./routes/payment');
const cors = require('cors');
const createError = require('http-errors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const {updateAccessToken} = require("./middlewares");

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(updateAccessToken);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/payment', paymentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
