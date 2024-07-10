const productoModel = require('../models/producto');

const getProductos = async (req, res ) => {
    try {
        const { limit, offset } = req.query;
        const limite = parseInt(limit) || 10; 
        const off = parseInt(offset) || 0;

        const [total, productos ] = await Promise.all([
            productoModel.countProductos(9),
           productoModel.productosLimit(limite, off)  
        ]);
      
        res.status(201).json({total, productos})
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};
const getProductosById = async (req, res) => {
    try {
        const idProducto = req.params.id;
        const producto = await productoModel.getProductosById(idProducto); 
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error });
    }
};
const createProducto = async (req, res) => {
    try {
        const { nombre, cantidad, precio } = req.body;
        const estado = 'Activo';
        
        const nuevoProducto = await productoModel.createProducto(nombre, cantidad, precio, estado);
        const usuarioAutenticado = req.uid;
        res.json({
            id:nuevoProducto,
            msg: 'Producto creado exitosamente',
            usuarioAutenticado  
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};
const editProducto = async (req, res) => {
    try {
        const idProducto = req.params.id;
        const { nombre, cantidad, precio, estado } = req.body;

        const rowsAffected = await productoModel.actualizarProducto(idProducto, nombre, cantidad, precio, estado);

        if (rowsAffected === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const usuarioAutenticado = req.uid;
        res.json({
            msg: 'Producto actualizado exitosamente',
            usuarioAutenticado
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    const estado = 'Inactivo';

    try {
        const productoCambio = await productoModel.deleteProducto(id, estado);
        if (!productoCambio) {
            return res.status(404).json({
                msg: `No se encontró un usuario con el ID: ${id}`
            });
        }
        res.json({
            msg: 'Producto inactivado correctamente',
            usuario: productoCambio
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al inactivar el usuario'
        });
    }
};
module.exports = { getProductos, getProductosById, createProducto, editProducto, deleteUsuario}