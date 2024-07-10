const pool = require('../config/database');

const getCompras = async () => {
    const [rows] = await pool.query('  SELECT compras.*, proveedores.nombre AS proveedorNombre FROM compras JOIN proveedores ON compras.idproveedor = proveedores.idproveedor');
    return rows;
};

const getComprasById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM compras WHERE idCompra = ?', [id]);
    return rows[0];
};

const createCompra = async (numerocompra, fechacompra, descuento, iva, subtotal, total, idproveedor, estado) => {
    const [result] = await pool.query(
        'INSERT INTO compras (numerocompra, fechacompra, descuento, iva, subtotal, total, idproveedor, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [numerocompra, fechacompra, descuento, iva, subtotal, total, idproveedor, estado]
    );
    return result.insertId;
};

//Detalle compra
const getDetalle = async (id) => {
    const rows = await pool.query('SELECT dc.*, p.nombre AS productoNombre FROM detalle_compra dc JOIN productos p ON dc.idProducto = p.idProducto WHERE dc.idCompra = ?', [id]);
    return rows[0];
};

const createDetalle = async (idCompra, idProducto, cantidad, preciounitario, total) => {
    const [result] = await pool.query(
        'INSERT INTO detalle_compra (idCompra, idProducto, cantidad, preciounitario, total) VALUES (?, ?, ?, ?, ?)',
        [idCompra, idProducto, cantidad, preciounitario, total]
    );
    return result.insertId; // Devuelve el ID del detalle de compra insertado
};


//Metodos adicionales
const numeroCompra = async (numerocompra) => {
    const [rows] = await pool.query('SELECT * FROM compras WHERE numerocompra = ?', [numerocompra]);
    return rows;
};
module.exports = { getCompras, getComprasById, createCompra, getDetalle, createDetalle, numeroCompra };
