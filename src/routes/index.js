const express = require('express');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');

const router = express.Router();

router.use('/', userRoutes);
router.use('/', postRoutes);

router.get('/', (req, res) => {
    res.send("<h1>Rede Social</h1> <p>Bem-vindo à nossa API de rede social! Aqui você pode criar uma conta, fazer login e compartilhar suas postagens com outros usuários. Explore as funcionalidades e conecte-se com amigos!</p> <p> documentação <a href='https://documenter.getpostman.com/view/43110445/2sBXitC7Qc'> aqui </a></p>");
});

module.exports = router;