const pool = require('../config/database');

const getAllProductos = async () => {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
};
const getProductosById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM  productos WHERE idProducto = ?', [id]);
    return rows[0];
};
const createProducto = async (nombre, cantidad, precio, estado = 'Activo') => {
    const [result] = await pool.query('INSERT INTO productos (nombre, cantidad, precio, estado) VALUES (?, ?, ?, ?)', [nombre, cantidad, precio, estado]);
    return result.insertId;
};
const actualizarProducto = async (idProducto, nombre, cantidad, precio, estado) => {
    const [result] = await pool.query('UPDATE productos SET nombre = ?, cantidad = ?, precio = ?,estado = COALESCE(?, estado) WHERE idProducto  = ?', [nombre, cantidad, precio, estado, idProducto]);
    return result.affectedRows;
};
const deleteProducto = async (idProducto, estado = 'Inactivo') => {
    const [result] = await pool.query( 'UPDATE productos SET estado = ? WHERE idProducto = ?', [estado, idProducto]);
    return result.affectedRows > 0;
}

//Metodos adicionales
const id = {
    firstOne: async ({ idProducto }) => {
        const [rows] = await pool.query('SELECT * FROM productos WHERE idProductos = ?', [idProducto]);
        return rows[0] || null;
    }
};
const countProductos = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM productos WHERE estado = 1');
    return rows[0].total;
};
const productosLimit = async (limit, offset) => {
    const [rows] = await pool.query(
        'SELECT * FROM productos WHERE estado = 1 LIMIT ? OFFSET ?',
        [limit, offset]
    );
    return rows;
};
const actualizarCantidadProducto = async (productoId, nuevaCantidad) => {
    try {
        // Actualizar la cantidad del producto
        const [result] = await pool.query('UPDATE productos SET cantidad = ? WHERE idProducto = ?', [nuevaCantidad, productoId]);

        if (result.affectedRows > 0) {
            console.log(`Cantidad actualizada para el producto con ID ${productoId}`);
        } else {
            throw new Error(`Producto con ID ${productoId} no encontrado`);
        }
    } catch (error) {
        throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
};




module.exports = { getAllProductos, getProductosById, createProducto, actualizarProducto, deleteProducto, id, countProductos, productosLimit,  actualizarCantidadProducto }