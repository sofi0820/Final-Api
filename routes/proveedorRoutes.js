const { Router } = require('express');
const proveedorController = require('../controllers/proveedores');
const { check } = require('express-validator');
const { validarCampos } = require ('../middlewares/validar-campos');
const { existeIdIngresado, existeTelefono } = require('../helpers/db-valitors');
const { tieneRol } = require('../middlewares/validar-roles');
const { validarJwt } = require('../middlewares/validar-jwt');

const router = Router();
router.get('/', proveedorController.getProveedores);
router.get('/:id', [
    check('id', 'No es un Id valido, por favor revise').isInt(),
    check('id', 'El Id ingresado no existe').custom(existeIdIngresado)
], proveedorController.getProveedoresById);
router.post('/', [    
    validarJwt,
    tieneRol('Administrador'),
    check('nombre', 'El nombre no es valido').not().isEmpty(),
    check('telefono').custom(existeTelefono),
    validarCampos
], proveedorController.createProveedor);
router.put('/:id',[
    validarJwt,
    tieneRol('Administrador'),
    check('id','El Id ingresado no es valido, verifique nuevamente').isInt(),
    check('id', 'El Id ingresado no exitse, por favor verifiquelo').custom(existeIdIngresado)
], proveedorController.editProveedor);
router.delete('/:id', [
    validarJwt,
    tieneRol('Administrador'),
    check('id','El Id ingresado no es valido, verifique nuevamente').isInt(),
    check('id', 'El Id ingresado no exitse, por favor verifiquelo').custom(existeIdIngresado)
], proveedorController.deleteProveedor);
// router.delete('/:id', productoController.deleteProducto);
module.exports = router;