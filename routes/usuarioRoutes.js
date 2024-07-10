const { Router } = require('express');
const usuarioController = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require ('../middlewares/validar-campos');
const { RolValido, existeIdIngresado } = require('../helpers/db-valitors');
const { validarJwt } = require('../middlewares/validar-jwt');
const { tieneRol } = require('../middlewares/validar-roles');

const router = Router(); 
router.get('/', usuarioController.getUsuarios);
router.get('/:id', [
    check('id', 'No es un Id valido, por favor revise').isInt(),
    check('id', 'El Id ingresado no existe').custom(existeIdIngresado)
], usuarioController.getUsuarioById);
router.post('/', [
    validarJwt,
    tieneRol('Administrador'),
    check('nombre', 'El nombre no es valido').not().isEmpty(),
    check('contrasena', 'La contraseña debe tener al menos 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('rol').custom(RolValido),
    validarCampos
], usuarioController.createUsuario);
router.put('/:id',[
    validarJwt,
    tieneRol('Administrador'),
    check('id','El Id ingresado no es valido, verifique nuevamente').isInt(),
    check('id', 'El Id ingresado no exitse, por favor verifiquelo').custom(existeIdIngresado)
], usuarioController.editUsuario);
router.delete('/:id', [ 
    validarJwt,
    tieneRol('Administrador'),
    check('id','El Id ingresado no es valido, verifique nuevamente').isInt(),
    check('id', 'El Id ingresado no exitse, por favor verifiquelo').custom(existeIdIngresado)
], usuarioController.deleteUsuario);
module.exports = router;
