const bycrypt = require('bcryptjs');
const User = require('../models/User');

const createUser = async (req, res) => {
    const { username, email, gender, password } = req.body;
    try {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.json({ success: false, message: 'Username already exists' });
        const existingUseremail = await User.findOne({ email });
        if (existingUseremail) return res.json({ success: false, message: 'Useremail already exists' });

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);
        const user = new User({ username, email, gender , password: hashedPassword });
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: 'Registration failed' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.json({ success: false, message: 'Invalid Username' });

        if(await bycrypt.compare(password, user.password)){
            req.session.user = user;
            res.json({ success: true });
        }
        else
            res.json({ success: false, message: 'Invalid Password' });
    } catch (err) {
        res.json({ success: false, message: 'Login failed' });
    }
};

const logoutUser = (req, res) => {
    try {
        req.session.destroy();
        res.json({ success: true });
    }
    catch (err) {
        res.json({ success: false, message: 'Logout failed' });
    }
};

const isLoggedIn = (req, res) => {
    if (req.session.user) {
        res.json({ valid: true , user: req.session.user});
    } else {
        res.json({ valid: false , message: 'User not logged in'});
    }
};

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    isLoggedIn
};