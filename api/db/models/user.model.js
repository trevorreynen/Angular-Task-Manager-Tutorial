const mongoose = require('mongoose')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

// JWT Secret
const jwtSecret = '51778657246321226641fsdklafjasdkljfsklfjd7148924065'

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
        minlength: 8
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



/** ============ INSTANCE METHODS ============ */

UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    // Return the document except the password and sessions (these shouldn't be made available).
    return _.omit(userObject, ['password', 'sessions'])
}

UserSchema.methods.generateAccessAuthToken = function() {
    const user = this

    // Create the JSON Web Token and return it.
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: '15m' }, (error, token) => {
            if (!error) {
                resolve(token)
            } else {
                reject()
            }
        })
    })
}

// This method generates a 64Byte hex string.
UserSchema.methods.generateRefreshAuthToken = function() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (error, buffer) => {
            if (!error) {
                let token = buffer.toString('hex')

                return resolve(token)
            }
        })
    })
}

UserSchema.methods.createSession = function() {
    let user = this

    return user
        .generateRefreshAuthToken()
        .then((refreshToken) => {
            return saveSessionToDatabase(user, refreshToken)
        })
        .then((refreshToken) => {
            // Saved to database successfully. Now, return the refresh token.
            return refreshToken
        })
        .catch((error) => {
            return Promise.reject('Failed to save session to database.\n' + error)
        })
}



/** ============= MODEL METHODS ============== (static methods) */

// Finds user by id and token. Used in Auth middleware (verifySession).
UserSchema.statics.findByIdAndToken = function(_id, token) {
    const User = this

    return User.findOne({
        _id,
        'sessions.token': token
    })
}

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this

    return User
        .findOne({
            email
        })
        .then((user) => {
            if (!user) {
                return Promise.reject()
            }

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (error, success) => {
                    if (success) {
                        resolve(user)
                    } else {
                        reject()
                    }
                })
            })
        })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000

    if (expiresAt > secondsSinceEpoch) {
        // Hasn't expired.
        return false
    } else {
        // Has expired.
        return true
    }
}



/** =============== MIDDLEWARE =============== */

UserSchema.pre('save', function(next) {
    let user = this
    let costFactor = 10

    // If the password field has been edited/changed.
    if (user.isModified('password')) {
        // Generate salt and hash password.
        bcrypt.genSalt(costFactor, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})



/** ============= HELPER METHODS ============= */

// Saves session to database.
let saveSessionToDatabase = (user, refreshToken) => {
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpirationTime()

        user.sessions.push({ 'token': refreshToken, expiresAt })

        user
            .save()
            .then(() => {
                // Session saved successfully.
                return resolve(refreshToken)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

let generateRefreshTokenExpirationTime = () => {
    let daysUntilExpire = '10'
    let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60

    return ((Date.now() / 1000) + secondsUntilExpire)
}


const User = mongoose.model('User', UserSchema)

module.exports = { User }

