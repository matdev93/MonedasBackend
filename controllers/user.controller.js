const User = require('../models/user');

const createUser = async(req, res) => {
   
    try {
        //* Validacion de email

        const userEmail = await User.findOne({ email: req.body.email })

        if(userEmail) {
            throw new Error('Email en uso!!!')
        }

        //* Guardar informacion en mi base de datos

        const newUser = new User(req.body);
        newUser.hashPassword(req.body.password);
        await newUser.save();


        res.json({success: true, message: "Usuario Creado", info: newUser._id, token: newUser.generateToken()})
            
    } catch (error) {
        res.json({success: false, message: error.message})
    }
};

const getUsers = async(req, res) => {
    try {
        const users = await User.find().populate('favoriteProducts');
        res.json({success: true, info: users })
    } catch (error) {
        res.json({success: false, message: error.message})
    }
};

// Funciones actualizar y delete

const editUser = async(req, res) => {

    try {
        const {id} = req.auth;
        const contain = req.body;

        const emails = await User.find()

        emails.forEach(userEmail => {
            if(userEmail.email === contain.email){
                throw new Error('Email en uso!')
            }
        // ver como mantener el correo sin coincidir con otro correo de BBDD.
        })

        const updateUser = await User.findByIdAndUpdate(id, contain, {new: true}).select('-password -salt -isAdmin');

        res.json({success: true, msg: "usuario actualizado", info: updateUser})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

const deleteUser =  async(req, res) => {
    try {
        // throw new Error('error forzado')
        const {id} = req.params;

        const destroyUser = await User.findByIdAndDelete(id);

        res.json({success: true, msg: "usuario eliminado", destroyUser})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

const login = async(req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if(!user){
            throw new Error('Usuario no registrado!!!')
        }

        const validatePassword = user.hashValidation(password, user.salt, user.password)

        if(!validatePassword){
            throw new Error('email o contraseña incorrecta!!!')
        }

        res.json({success: true, message: 'Has iniciado sesion', token: user.generateToken()})

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

const getUserVerify = async(req, res) => {
    try {
        const { id } = req.auth

        const user = await User.findById(id).populate('favoriteProducts').select('-password -salt');

        res.json({success: true, msg: `Informacion de: ${user.email}`, info: user })

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

module.exports = {createUser, getUsers, editUser, deleteUser, login, getUserVerify};