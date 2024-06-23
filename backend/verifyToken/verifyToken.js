const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    let authheader = req.headers.token
    if (authheader) {
        const token = authheader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(403).json('Token not valid');
            }
            req.user = user
            next();
        });
    }
    else {

        return res.status(403).json('You are not authenticated');
    }
};


const verifyTokenandAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user._id === req.params.id) {
            next()
        } else {
            return res.status(403).json('your are not allowed')
        }
    })
}
module.exports = { verifyToken, verifyTokenandAuthorization }



  
