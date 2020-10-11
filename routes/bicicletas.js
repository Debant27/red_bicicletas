var express = require('express');
var router = express.Router();
var bicicletaController = require('../controllers/bicicleta');

router.get('/',bicicletaController.bicicleta_list);
router.get('/create',bicicletaController.bicicleta_create_get);
router.post('/create',bicicletaController.bicicleta_create_post);
router.get('/:id/update',bicicletaController.bicicleta_update_get);
router.post('/:id/update',bicicletaController.bicicleta_update_post);
router.post('/:id/delete', bicicletaController.bicicleta_delete_post);

//El exports es para que pueda ser importado en otros modulos o vistas
module.exports = router;