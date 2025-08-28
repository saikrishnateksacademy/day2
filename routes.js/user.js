const express =  require ("express");
const router= express.Router();

router.post('/api/v1/users', (req,res)=>{
    res.status(200).json({message: 'user created successfully'})
})

router.get('/api/v1/users', (req,res)=>{
    res.status(200).json({users:"here are the all the users "})
})

router.get("/api/v1/users/:id", (req, res) => {
  res.status(200).json({ userId: req.params.id });
});

module.exports = router;