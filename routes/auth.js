const router = require('express').Router();
const User = require('../models/User')
const AES = require('crypto-js/aes')
const cJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const { verifyToken } = require("./verifyToken");

router.post('/register', async (req, res)=> { 
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: AES.encrypt(req.body.password, process.env.AES_KEY).toString()
    });

    try {
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch(err) {
        return res.status(500).json(err);
    }
}
)

router.post('/login', async (req, res) => {
    try {
        var user;
        if (req.body.email) {user = await User.findOne({email: req.body.email})}
        else if(req.body.username) {user = await User.findOne({username: req.body.username})};
        
        if (!user) {
            return res.status(401).send("User doesn't exist");
        };

        const decryptedPassword = AES.decrypt(user.password, process.env.AES_KEY).toString(cJS.enc.Utf8);
        if (decryptedPassword != req.body.password) {
            console.log(decryptedPassword, user.password, decryptedPassword==user.password);
            return res.status(401).send("Wrong password");
        }

        const webToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_KEY,{expiresIn:"20d"});

        const { password, ...others } = user._doc;

        //, 
        res.cookie('token', webToken, {httpOnly: true,
             expires: new Date(Date.now() + 100000000000),
             sameSite: 'lax'})
             .status(200)
        console.log(res.getHeader('set-cookie'))
        res.send({...others});
    } catch(err) {
        return res.status(500).json(err);
    }
})

router.post('/logout', (req, res) => {
    const { cookies } = req;
    const { token } = cookies
    
    if (!cookies) {
    return res.status(401).json({
        status: 'error',
        error: 'Unauthorized',
    });
    }

    // Estou apenas removendo o token dos cookies em uma abordagem client-sided.
    // Seria benéfico também incluir o token em uma blacklist do servidor,
    // assim garantindo uma camada adicional de segurança, server-sided
    res.cookie('token', null, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: -1,
        });

    return res.status(200).json({
    status: 'success',
    message: 'Logged out',
    });

})

router.post('/verifytoken', verifyToken, (req, res) => {
    res.status(200).json('Valid Token')
})




module.exports = router;

