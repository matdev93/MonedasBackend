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

const user = mongoose.model('user', userSchema);

module.exports = user;