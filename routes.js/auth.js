const express =  require("express");
const router = express.Router();

router.post('/api/v1/auth/register', (req,res) => {
    res.status(201).json({message:"registered"})
})


router.post('/api/v1/auth/login', (req,res) => {
    res.status(200).json({message:"loged in "})
})

router.post('/api/v1/auth/logout', (req,res) => {
    res.status(200).json({message:"logout page"})
})


module.exports = router