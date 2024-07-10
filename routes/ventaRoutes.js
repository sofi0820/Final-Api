const { Router } = require('express');
const ventasController = require('../controllers/ventas');
const { existeIdIngresado} = require('../helpers/db-valitors');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();
router.get('/', ventasController.getVentas);
router.get('/:id', [
    check('id', 'No es un Id valido, por favor revise').isInt(),
    check('id').custom(existeIdIngresado)
], ventasController.getVentaById);
router.post('/', [
    validarCampos
], ventasController.createVenta);


module.exports = router;
