const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Nombre no especificado",
        trim: true,
        lowercase: true,
        minLength: 2
    },
    email: {
        type: String,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g],
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    },
    password: {
        type: String,
        match: [/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,20}$/gm],
        required: true
    },
    salt: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    favoriteProducts: {
        type: mongoose.Types.ObjectId,
        ref: "product"
    }
})

userSchema.methods.hashPassword = function(password){
    this.salt = crypto.randomBytes(10).toString('hex'); 
    this.password = crypto.pbkdf2Sync(password, this.salt, 5000, 10, 'sha512').toString('hex');
}

userSchema.methods.hashValidation = function(password, salt, passwordDB){
    const hash = crypto.pbkdf2Sync(password, salt, 5000, 10, 'sha512').toString('hex')
    return hash === passwordDB;
}

userSchema.methods.generateToken = function(){

    const payload = {
        id: this._id,
        email: this.email
    }

    const token = jwt.sign(payload, process.env.SECRET, {expiresIn: "7d"})
    return token;
}

const user = mongoose.model('user', userSchema);

module.exports = user;