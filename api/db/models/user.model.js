const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// JWT Private Key
const jwtSecret = "210456359i6WXeVC1IPWrijVbCuG21045635I7CXL7SKBW";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
})

/**
 * Instance Methods
 */
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();

    // Returning document except for the password and sessions, which should not be made available.
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function() {
    const user = this;

    return new Promise((resolve, reject) => {
        // Creating the JSON Web Token and returning it.
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject();
            }
        })
    })
}

/**
 * Generates a 64-byte hex string. saveSessionToDatabase() will save it to Mongo.
 */
UserSchema.methods.generateRefreshAuthToken = function() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex');
                return resolve(token);
            }
        })
    })
}

UserSchema.methods.createSession = function() {
    let user = this;
    
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e) => {
        return Promise.reject("Failed to save session to database.\n" + e)
    })
}

/**
 * Model Methods (static methods)
 */

 UserSchema.statics.findByIdAndToken = function(_id, token) {
    // Finds user by their id and token.

     const User = this;
     
     return User.findOne({
         _id,
         'sessions.token': token
     })
 }

 UserSchema.statics.findByCredentials = function(email, password) {
     let User = this;

     return User.findOne({ email }).then((user) => {
         if (!user) {
             return Promise.reject();
         }

         return new Promise((resolve, reject) => {
             bcrypt.compare(password, user.password, (err, res) => {
                 if (res) {
                     resolve(user);
                 } else {
                     reject();
                 }
             })
         })
     })
 }

 UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
     let secondsSinceEpoch = Data.now() / 1000;

     // Hasn't expired
     if (expiresAt > secondsSinceEpoch) {
         return false;
     } else {
         return true;
     }
 }

 /**
  * AUTH MIDDLEWARE
  */

  UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    if (user.isModified('password')) {
        // If user password field has been changed, then execute the following.

        // Generating salt and hashing password.
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
  });

/**
 * Helper methods
 */

/**
 * Saves current session to the database. Session = Refresh Token + Expiry Time
 */
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({ 'token': refreshToken, expiresAt });
        user.save().then(() => {
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

/**
 * Generates a UNIX timestamp for 10 days from now to expire the session.
 */
let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = daysUntilExpire * 24 * 3600;

    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };