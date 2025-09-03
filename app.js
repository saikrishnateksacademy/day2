const express = require('express')
const { dbconnection } = require("./config/dbconnection");
const {User} = require('./model/user.model');
require('dotenv').config();


const port = 5000;
const app = express()
app.use(express.json());

const router = require('./routes.js/index');

app.use('/',router,(req,res)=>{
res.send("this is the home page type the end point ant the url to see the output of routers /api/v1/users  /api/v1/admin/users /api/v1/admin/users ")
})

app.use('/',router);

dbconnection();


app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`)
})