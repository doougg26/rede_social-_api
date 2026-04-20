const pool = require('../config/db');

class Post {
    static async findAll() {
        const resultado = await pool.query(`
            SELECT
                usuarios.id AS usuarios_id,
                usuarios.nome,
                posts.conteudo,
                posts.titulo,
                posts.criado_em,
                posts.id AS post_id
            FROM posts
            JOIN usuarios ON posts.usuario_id = usuarios.id
            ORDER BY posts.criado_em DESC
        `);
        return resultado.rows;
    }

    static async create({ titulo, conteudo, usuario_id }) {
        const resultado = await pool.query(`
            INSERT INTO posts (titulo, conteudo, usuario_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [titulo, conteudo, usuario_id]);
        return resultado.rows[0];
    }

    static async findById(id) {
        const resultado = await pool.query(`
            SELECT * FROM posts WHERE id = $1
        `, [id]);
        return resultado.rows[0];
    }

    static async update(id, { titulo, conteudo }) {
        const resultado = await pool.query(`
            UPDATE posts
            SET titulo = $1, conteudo = $2
            WHERE id = $3
            RETURNING *
        `, [titulo, conteudo, id]);
        return resultado.rows[0];
    }

    static async delete(id) {
        const resultado = await pool.query(`
            DELETE FROM posts WHERE id = $1 RETURNING *
        `, [id]);
        return resultado.rows[0];
    }
}

module.exports = Post;