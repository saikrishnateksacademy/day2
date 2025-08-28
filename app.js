const express = require('express')
const port = 3000;
const app = express()

const router = require('./routes.js/index');
app.use('/',router)

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`)
})