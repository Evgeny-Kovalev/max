const express = require('express');
const iterationsController = require('../controllers/iterationsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, iterationsController.getIterations);
router.get('/:iterationId', authMiddleware, iterationsController.getIteration);

router.post('/', authMiddleware, iterationsController.postIteration);
router.put('/:iterationId', authMiddleware, iterationsController.putEditIteration);
router.delete('/:iterationId', authMiddleware, iterationsController.deleteIteration);

module.exports = router;
