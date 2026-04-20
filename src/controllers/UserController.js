const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserController {
    static async create(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const usuario = await User.create({ nome, email, senha });
            res.status(201).json({
                mensagem: "usuario criado com sucesso",
                usuario
            });
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao criar usuario" });
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body;
        const usuario = await User.findByEmail(email);

        if (!usuario) {
            return res.status(400).json({
                mensagem: "usuario não encontrado"
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(400).json({
                mensagem: "senha inválida"
            });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.json({ token });
    }

    static async getAll(req, res) {
        try {
            const usuarios = await User.findAll();
            res.json(usuarios);
        } catch (erro) {
            res.status(500).json({ erro: "erro ao buscar usuarios" });
        }
    }
}

module.exports = UserController;