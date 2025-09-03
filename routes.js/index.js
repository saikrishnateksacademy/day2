const express = require('express')
const router = express.Router();

const userRouter = require('./user.rout.js')
const authRouter = require('./auth.rout.js')
const adminRouter = require('./admin.rout.js')

router.use( userRouter);
router.use( authRouter);
router.use( adminRouter);

module.exports= router