const ventaModel = require('../models/venta');
const productoModel = require('../models/producto');


const getVentas = async (req, res) => {
    try {
        const ventas = await ventaModel.getVentas();
        res.status(201).json({ ventas });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error });
    }
};

const getDetalle = async (req, res) => {
    try {
        const idVenta = req.params.idVenta;
        const detalleVenta = await compraModel.getDetalle(idVenta);
        res.status(200).json({ detalleVenta });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los detalles de la compra', error });
    }
};

const getVentaById = async (req, res) => {
    try {
        const idVenta = req.params.id;
        const venta = await ventaModel.getVentaById(idVenta);
        const detalleVenta = await ventaModel.getDetalle(idVenta)
        if (venta) {
            res.json({venta, detalleVenta});
        } else {
            res.status(404).json({ message: 'Venta no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la venta', error });
    }
};

const createVenta = async (req, res) => {
    try {
        const { nombreCliente, fechaVenta, descuento, iva, subtotal, total, estado } = req.body.venta;
        const detalleVenta = req.body.detalle;

        const nuevaVentaId = await ventaModel.createVenta(
            nombreCliente,
            fechaVenta,
            descuento,
            iva,
            subtotal,
            total,
            estado
        );

        const detallesPromises = detalleVenta.map(async (detalle) => {
            const producto = await productoModel.getProductosById(detalle.id);

            if (producto) {
                const nuevaCantidad = producto.cantidad - detalle.cantidad;
                await productoModel.actualizarCantidadProducto(detalle.id, nuevaCantidad);
            } else {
                throw new Error(`Producto con ID ${detalle.id} no encontrado`);
            }

            await ventaModel.createDetalle(
                nuevaVentaId,
                detalle.id,
                detalle.cantidad,
                detalle.precio,
                detalle.cantidad * detalle.precio
            );
        });

        await Promise.all(detallesPromises);

        res.status(201).json({ id: nuevaVentaId, message: 'Venta creada exitosamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear la venta', error: error.message });
    }
};

module.exports = { getVentas, getVentaById, createVenta, getDetalle };