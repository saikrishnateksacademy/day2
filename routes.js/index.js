const express = require('express')
const router = express.Router();

const userRouter = require('./user.js')
const authRouter = require('./auth.js')
const adminRouter = require('./admin.js')

router.use( userRouter);
router.use( authRouter);
router.use( adminRouter);

module.exports= router