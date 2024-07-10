const { Router } = require('express');
const comprasController = require('../controllers/compras');
const { existeIdIngresado, existeNumeroCompra } = require('../helpers/db-valitors');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();
router.get('/', comprasController.getCompras);
router.get('/:id',  [
    check('id', 'No es un Id valido, por favor revise').isInt(),
    check('id', 'El Id ingresado no existe').custom(existeIdIngresado)
],comprasController.getCompraById);
router.post('/', [
    check('numerocompra', 'El número de compra no es válido, ya fue registrado').custom(existeNumeroCompra),
    validarCampos
], comprasController.createCompra);
router.get('/comprasDetalle/:id', comprasController.getDetalle)


module.exports = router;
