const { generarJwt} = require('../helpers/generar-jwt');
const usuarioModel = require('../models/usuario');
const bcryptjs = require('bcryptjs')

const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    const usuario = await usuarioModel.getUsuarioByCorreo(correo);
    //Verificar correo
    if (!usuario) {
        return res.status(401).json({ msg: 'Alguna de la información enviada no es correcta' });
    }

    //Validar estado
    if (usuario.estado !== 'Activo') {
        return res.status(401).json({ msg: 'El usuario esta inactivo' });
    }
     
    //Validar contraseña
    const validarContrasena =  bcryptjs.compareSync(contrasena, usuario.contrasena)
    if (!validarContrasena) {
        return res.status(401).json({ msg: 'La contraseña no es correcta' });
    }

    //Generar JWT
    const token = await generarJwt(usuario.idUsuario,usuario.nombre,usuario.correo,usuario.rol,usuario.img,usuario.estado );

    try {
        res.json({ usuario, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

module.exports = login