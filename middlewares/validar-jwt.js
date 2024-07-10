const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario');
const { response } = require('express');

const validarJwt = async (req, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ message: 'Debes ingresar para acceder en la solicitud' });
    }

    try {
        const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await usuarioModel.getUsuarioById(payload.uid);

        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        if (!usuario.estado) {
            return res.status(401).json({ message: 'Usuario inactivo' });
        }

        req.usuario = usuario; // Establecer el usuario en req
        next();
    } catch (error) {
        console.log('Error al verificar el token:', error);
        res.status(401).json({ message: 'Token no válido' });
    }
};

module.exports = { validarJwt };
