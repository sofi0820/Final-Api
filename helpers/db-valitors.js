const usuarioModel = require('../models/usuario');
const proveedorModel = require('../models/proveedor');
const compraModel = require('../models/compra');
const rolesValidos = ['Administrador', 'Usuario'];



const RolValido = (role) => {
    if (!rolesValidos.includes(role)) {
        throw new Error('El rol no es válido');
    }
    return true;
};

const existeIdIngresado = async (idUsuario) =>{
    const existeId = await usuarioModel.id.firstOne({idUsuario});
    if (!existeId) {
        throw new Error('El correo ya  se encuentra registrado.');
    }
    return true;
};

const existeTelefono = async(telefono) => {
    const existeTel = await proveedorModel.telefono(telefono); 
    if (existeTel.length > 0) {
        throw new Error('El teléfono ya está registrado, verifique los datos ingresados');
    }
    return true;
}

const existeNumeroCompra = async (numerocompra) =>  {
    const existeCompra = await compraModel.numeroCompra(numerocompra);
    if (existeCompra.length > 0) {
        throw new Error('El número de compra ya está registrado, verifique los datos ingresados');
    }
    return true;
}
module.exports = {RolValido, existeIdIngresado, existeTelefono, existeNumeroCompra }