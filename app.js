const express = require('express')
const port = 3000;
const app = express()

const router = require('./routes.js/index');
app.use('/',router,(req,res)=>{
res.send("this is the home page type the end point ant the url to see the output of routers /api/v1/users  /api/v1/admin/users /api/v1/admin/users ")
})

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`)
})