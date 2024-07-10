const proveedorModel = require ('../models/proveedor');

const getProveedores = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const limite = parseInt(limit) || 10; 
        const off = parseInt(offset) || 0;

          // Obtener usuarios y el conteo total de usuarios con estado 1
          const [total, proveedores] = await Promise.all([
            proveedorModel.countProveedores(),
            proveedorModel.proveedoresLimit(limite, off)  
        ]);

        res.status(201).json({total, proveedores });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};
const getProveedoresById = async (req, res) => {
    try {
        const idProveedor = req.params.id;
        const proveedor = await proveedorModel.getProveedoresById(idProveedor); 
        if (proveedor) {
            res.json(proveedor);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
};
const createProveedor = async (req, res) => {
    try {
        const { nombre, direccion, telefono} = req.body;
        const estado = 'Activo';
        const nuevoProveedor = await proveedorModel.createProveedor(nombre, direccion, telefono, estado);
        const usuarioAutenticado = req.uid;
        res.json({ 
            id: nuevoProveedor,
            message: 'Proveedor creado exitosamente',
            usuarioAutenticado  
        });
        res.status(201).json({ id: nuevoProveedor, message: 'Proveedor creado exitosamente' });   
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el proveedor', error });
    }
};
const editProveedor = async (req, res) => {
    try {
        const idProveedor = req.params.id;
        const { nombre, direccion, telefono, estado } = req.body;
        const rowsAffected = await proveedorModel.actualizarProveedor(idProveedor, nombre, direccion, telefono, estado);

        if (rowsAffected === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        const usuarioAutenticado = req.uid;
        res.json({
            msg: 'Proveedor actualizado exitosamente',
            usuarioAutenticado
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el proveedor', error: error.message });
    }
};
const deleteProveedor = async (req, res) => {
    const { id } = req.params;
    const estado = 'Inactivo';

    try {
        const proveedorCambio = await proveedorModel.cambiarEstado(id, estado);
        if (!proveedorCambio) {
            return res.status(404).json({
                msg: `No se encontró un proveedor con el ID: ${id}`
            });
        }
        const usuarioAutenticado = req.uid;
        res.json({
                msg: 'Proveedor inactivado correctamente',
                usuario: {
                    proveedorCambio
            },
            usuarioAutenticado  
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al inactivar el proveedor'
        });
    }
};

module.exports = { getProveedores, getProveedoresById, createProveedor, editProveedor, deleteProveedor}