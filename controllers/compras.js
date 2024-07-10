const compraModel = require('../models/compra');
const proveedorModel = require('../models/proveedor');
const productoModel = require('../models/producto');

const getCompras = async (req, res) => {
    try {
        const compras = await compraModel.getCompras();
        const proveedores = await proveedorModel.getAllProveedores();
        const productos = await productoModel.getAllProductos();
        res.status(201).json({compras})
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las compras', error });
    }
};

const getDetalle = async (req, res) => {
    try {
        const idCompra = req.params.id;
        const detalleCompra = await compraModel.getDetalle(idCompra);
        res.status(201).json({ detalleCompra });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los detalles de la compra', error });
    }
};

const getCompraById = async (req, res) => {
    try {
        const idCompra = req.params.id;
        const compra = await compraModel.getComprasById(idCompra);
        const detalleCompra = await compraModel.getDetalle(idCompra);
        if (compra) {
            res.json({compra, detalleCompra});
        } else {
            res.status(404).json({ message: 'Compra no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la compra', error });
    }
};

//Validar proveedor
//Fecha de registro en el sistema
const createCompra = async (req, res) => {
    try {
        const { numerocompra, fechacompra, descuento, iva, subtotal, total, idproveedor, estado } = req.body.compra;
        const detallesCompra = req.body.detalle;

        const nuevaCompraId = await compraModel.createCompra(
            numerocompra, 
            fechacompra,
            descuento,
            iva,
            subtotal,
            total,
            idproveedor,
            estado
        );

        const detallesPromises = detallesCompra.map(async (detalle) => {
            const producto = await productoModel.getProductosById(detalle.id);

            if (producto) {
                const nuevaCantidad = producto.cantidad + detalle.cantidad;
                await productoModel.actualizarCantidadProducto(detalle.id, nuevaCantidad);
            } else {
                throw new Error(`Producto con ID ${detalle.id} no encontrado`);
            }

            await compraModel.createDetalle(
                nuevaCompraId,
                detalle.id,
                detalle.cantidad,
                detalle.precio,
                detalle.cantidad * detalle.precio
            );
        });

        await Promise.all(detallesPromises);



        res.status(201).json({ id: nuevaCompraId, message: 'Compra creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(500).json({ message: 'Error al crear la compra', error });
    }
};



module.exports = { getCompras, getCompraById, createCompra, getDetalle };
