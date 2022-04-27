const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, projectController.getProject);

router.post('/', authMiddleware, projectController.postProject);
router.put('/:id', authMiddleware, projectController.putEditProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;
