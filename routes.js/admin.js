const express = require ("express");
const router = express.Router();


router.post('/api/v1/admin/users',(req,res)=>{
    res.status(200).json({users:"admin user creating page"})
});

router.get("/api/v1/admin/users", (req, res) => {
  res.status(200).json({ users: [] });
});

router.delete("/api/v1/admin/users/:id", (req, res) => {
  res.status(200).json({ message: `User ${req.params.id} deleted by admin` });
});

module.exports = router


// /api/v1/users - POST
// /api/v1/users - GET
// /api/v1/users/:id - GET
// /api/v1/users/:id - PATCH
// /api/v1/users/:id - DELETE