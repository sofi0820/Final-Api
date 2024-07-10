const pool = require('../config/database');

const getAllUsuarios = async() => {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows; 
};
const getUsuarioById = async (id) => {   
const [rows] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id]);
return rows[0];
};
const createUsuario = async (nombre, correo, contrasena, img, rol, estado = 'Activo', google = 'false') => {
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, correo, contrasena, img, rol, estado, google) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, correo, contrasena, img, rol, estado, google]
    );
    return result.insertId;
};
const actualizarUsuario = async (idUsuario, nombre, correo, contrasena, img, rol, estado) => {
    const [result] = await pool.query(
        'UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, img = ?, rol = ?, estado = ? WHERE idUsuario = ?',
        [nombre, correo, contrasena, img, rol, estado, idUsuario] 
    );
    return result.affectedRows;
};
const deleteUsuario = async (idUsuario, estado = 'Inactivo') => {
    const [result] = await pool.query( 'UPDATE usuarios SET estado = ? WHERE idUsuario = ?', [estado, idUsuario]);
    return result.affectedRows > 0;
}

//Metodos adicionales
const getUsuarioByCorreo = async (correo) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0] || null;
};
const id = {
    firstOne: async ({ idUsuario }) => {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario]);
        return rows[0] || null;
    }
};
const countUsuarios = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM usuarios WHERE estado = 1');
    return rows[0].total;
};
const usuariosLimit = async (limit, offset) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE estado = 1 LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows;
};

module.exports = { getAllUsuarios, getUsuarioById, createUsuario, actualizarUsuario, deleteUsuario, getUsuarioByCorreo, id, countUsuarios, usuariosLimit}