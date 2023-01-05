const User = require('../models/User.js')
const AES = require('crypto-js/aes')

const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken.js');

const router = require('express').Router();


// Verify session token then UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
        ).toString();
      }
    
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        return res.status(200).json(updatedUser);
      } catch (err) {
        return res.status(500).json(err);
      }
    });

// Verify session token then DELETE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        return res.status(200).json("User deleted");
    } catch(err) {
      return res.status(500).json(err);
    };
});

// Verify session token then return user (GET)
router.get('/find/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        const { password, ...noPassword} = user._doc;
        return res.status(200).json(noPassword);
    } catch(err) {
      return res.status(500).json(err);
    }
});

// Verify session token then return ALL users (GET)
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query? await User.find().sort({_id:-1}).limit(5): await User.find();
    } catch(err) {
      return res.status(500).json(err);
    }
})

// Verify session token then return STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  });


module.exports =router;


