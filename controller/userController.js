const User = require('../model/usersModel');

// Checks if the username or email already exists in the user document
exports.checkUsernameOrEmailExists = async (username=undefined, email=undefined) => {
    try {
        // Checks if the user or email exists in the user document
        const query = await User.exists({
            $or: [{username: username}, {email: email}]
        });

        // If there is a query result then return true. False if it does not exist.
        if (query) {
            return true;

        } else {
            return false;
        }

    } catch (error) {
        throw new Error(`A DB error occured when checking if username or email exists: ${error}`);
    }
};

// Get user's info given username
exports.getUser = async (username) => {
    try {
        const user = await User.findOne().where('username').equals(username);
        return user;
        
    } catch (error) {
        throw new Error(`A DB error occured when getting username: ${error}`);
    }
};

// Create user entry in mongoDB
exports.createUser = async (username, email, password) => {
    const newUser = new User({username: username, email: email, password: password});

    try {
        await newUser.save();
        return newUser;

    } catch (error) {
        throw new Error(`A DB error occured when finding user by username in createUser: ${error}`);
    }
};