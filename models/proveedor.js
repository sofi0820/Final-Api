const pool = require('../config/database');

const getAllProveedores = async () => {
    const [rows] = await pool.query('SELECT * FROM proveedores');
    return rows;
}
const getProveedoresById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM  proveedores WHERE idProveedor = ?', [id]);
    return rows[0];
}
const createProveedor = async (nombre, direccion, telefono, estado = 'Activo') => {
    const [result] = await pool.query('INSERT INTO proveedores (nombre, direccion, telefono, estado) VALUES (?,?,?,?)', [nombre,direccion, telefono, estado ]);
    return result.insertId;
}
const actualizarProveedor = async (idProveedor, nombre, direccion, telefono, estado) => {
    const [result] = await pool.query('UPDATE proveedores SET nombre = ?, direccion = ?, telefono = ?, estado = ? WHERE idProveedor = ?', [nombre, direccion, telefono, estado, idProveedor]);
    return result.affectedRows;
}
const deleteProveedor = async (id) => {
    const [result] = await pool.query('DELETE * FROM proveedores WHERE idProveedor = ?',[idProveedor]);

}

//Metodos adicionales
const cambiarEstado = async (idProveedor, estado ='Inactivo') => {
    const [result] = await pool.query('UPDATE proveedores SET estado = ? WHERE idProveedor = ?', [estado, idProveedor]);
    return result.affectedRows > 0;
}
const id = {
    firstOne: async ({ idUsuario }) => {
        const [rows] = await pool.query('SELECT * FROM proveedores WHERE idUsuario = ?', [idProveedor]);
        return rows[0] || null;
    }
};
const countProveedores = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM proveedores WHERE estado = 1');
    return rows[0].total;
};
const proveedoresLimit = async (limit, offset) => {
    const [rows] = await pool.query(
        'SELECT * FROM proveedores WHERE estado = 1 LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows;
};
const telefono = async (telefono) => {
    const [rows] = await pool.query('SELECT * FROM proveedores WHERE telefono = ?',[telefono]);
    return rows;
}
module.exports = { getAllProveedores, getProveedoresById, createProveedor, actualizarProveedor, cambiarEstado, id, countProveedores, proveedoresLimit, telefono }