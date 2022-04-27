const express = require('express');
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, tasksController.getTasks);
router.get('/:taskId', authMiddleware, tasksController.getTask);

router.post('/', authMiddleware, tasksController.postTask);
router.put('/:taskId', authMiddleware, tasksController.putEditTask);
router.delete('/:taskId', authMiddleware, tasksController.deleteTask);

module.exports = router;
