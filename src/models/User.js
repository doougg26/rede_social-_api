const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async create({ nome, email, senha }) {
        const senhaHash = await bcrypt.hash(senha, 10);
        const resultado = await pool.query(`
            INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [nome, email, senhaHash]);
        return resultado.rows[0];
    }

    static async findByEmail(email) {
        const resultado = await pool.query(`
            SELECT * FROM usuarios WHERE email = $1
        `, [email]);
        return resultado.rows[0];
    }

    static async findAll() {
        const resultado = await pool.query(`SELECT * FROM usuarios`);
        return resultado.rows;
    }
}

module.exports = User;