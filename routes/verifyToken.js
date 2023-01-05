const jwt = require('jsonwebtoken');

// JWT authentication middlewares
const verifyToken = (req, res, next) => {
    const { cookies } = req;
    const { token } = cookies
    
    if(!token) { return res.status(401).json('Not authenticated!')}

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if(err) {return res.status(401).json('Token not valid.')}
        req.user = user;
        next();

    });
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };

  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };



module.exports = {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin};