const express = require('express');
const PostController = require('../controllers/PostController');
const auth = require('../middleware/auth');
const validarPosts = require('../middleware/validations/posts');

const router = express.Router();

router.get('/posts', PostController.getAll);
router.post('/posts', auth, validarPosts, PostController.create);
router.put('/posts/:id', auth, validarPosts, PostController.update);
router.delete('/posts/:id', auth, PostController.delete);

module.exports = router;