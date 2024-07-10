const pool = require('../config/database');

const getVentas = async () => {
    const [rows] = await pool.query('SELECT * FROM ventas');
    return rows;
};

const getVentaById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM ventas WHERE idVenta = ?', [id]);
    return rows[0];
};

const createVenta = async (nombreCliente, fechaVenta, descuento, iva, subtotal, total,estado) => {
    const [result] = await pool.query(
        'INSERT INTO ventas (nombreCliente, fechaVenta, descuento, iva, subtotal, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombreCliente, fechaVenta, descuento, iva, subtotal, total, estado]
    );
    return result.insertId;
};

const createDetalle = async (idVenta,idProducto,cantidad,precio, total) => {
    const [result] = await pool.query(
        'INSERT INTO detalle_venta (idVenta, idProducto, cantidad, precio, total) VALUES (?, ?, ?, ?, ?)',
        [idVenta, idProducto, cantidad, precio, total]
    );
    return result.insertId; 
}

const getDetalle = async (idVenta) => {
    const rows = await pool.query('SELECT dc.*, p.nombre AS productoNombre FROM detalle_venta dc JOIN productos p ON dc.idProducto = p.idProducto WHERE dc.idVenta = ?', [idVenta]);
    return rows[0];
};

//Metodos adicionales
// const numeroCompra = async (numerocompra) => {
//     const [rows] = await pool.query('SELECT * FROM compras WHERE numerocompra = ?', [numerocompra]);
//     return rows;
// };
module.exports = { getVentas, getVentaById, createVenta, createDetalle, getDetalle };
