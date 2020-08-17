const User = require('../models/user')
const httpError = require('../models/httpError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.signupUser = async function(req,res,next) {
    let user;
    let token;
    let { name, email, password } = req.body;

    try {
        user = await User.findOne({ where: { email: email}})
    } catch (error) {
        return next(error)
    }

    if (user) {
        next(new httpError('User already exists, use another email'), 422)
    }

    try {      
        const hash = await bcrypt.hash(password, 12)
        password = hash
        user = await User.create({ name, email, password})
        token = jwt.sign({ userId: user.id, email: user.email }, "super_secret_password", { expiresIn: 300 })
        
    } catch (error) {
        return next(error)
    }

    res.status(201).json({ userId: user.id, email: user.email, token : token})

}

exports.loginUser = async function (req, res, next) {
    let user;
    let token;
    const { email, password } = req.body;

    let identifyUser;
    try {
        identifyUser = await User.findOne({ where: { email: email } });
    } catch (error) {
        next(new httpError("Could not connect to server", 500));
    }

    if (!identifyUser) {
        return next(
          new httpError("User does not exist or password is incorrect", 401)
        );
    }

    let compareUser;

    try {
        compareUser = await bcrypt.compare(password, identifyUser.password);
    } catch (error) {
        return next(
          new httpError(
            "Could not login user, try again with correct password",
            500
          )
        );
    }

    if (!compareUser) {
        return next(
          new httpError("User does not exist or password is incorrect", 401)
        );
    }

    try {
        token = jwt.sign(
        { userId: identifyUser.id, email: identifyUser.email },
        "super_secret_password",
        { expiresIn: 300 }
        );
    } catch (error) {
        return next(new httpError("Logging in Failed"), 500);
    }
    user = identifyUser;
    try {
            const cart = await user.getCart();
            console.log(cart);
            if (!cart) {
              await user.createCart();
              console.log("Cart created");
            }
    } catch (error) {
        return next(new httpError("Logging in Failed"), 500);
    }


    res.json({
        userId: user.id,
        email: user.email,
        token: token 
    });
};