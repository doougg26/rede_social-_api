const Post = require('../models/Post');

class PostController {
    static async getAll(req, res) {
        try {
            const posts = await Post.findAll();
            const dados = posts.map((post) => ({
                ...post,
                criado_em: formatarData(post.criado_em),
            }));
            res.json(dados);
        } catch (erro) {
            res.status(500).json({ erro: "Erro ao buscar postagens" });
        }
    }

    static async create(req, res) {
        try {
            const { titulo, conteudo } = req.body;
            const post = await Post.create({ titulo, conteudo, usuario_id: req.usuario.id });
            res.status(201).json({
                mensagem: "Post Criado com sucesso",
                post,
            });
        } catch (erro) {
            res.status(500).json({
                erro: "erro ao criar postagem",
            });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { titulo, conteudo } = req.body;

            const post = await Post.findById(id);

            if (!post) {
                return res.status(404).json({
                    mensagem: "post não encontrado"
                });
            }

            if (post.usuario_id !== req.usuario.id) {
                return res.status(403).json({
                    mensagem: "sem permissão"
                });
            }

            const updatedPost = await Post.update(id, { titulo, conteudo });

            res.status(200).json({
                mensagem: "Post Atualizado com sucesso",
                post: updatedPost,
            });
        } catch (erro) {
            res.status(500).json({
                erro: "Erro ao atualizar post"
            });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const post = await Post.findById(id);

            if (!post) {
                return res.status(404).json({
                    mensagem: "post não encontrado"
                });
            }

            if (post.usuario_id !== req.usuario.id) {
                return res.status(403).json({
                    mensagem: "sem permissão"
                });
            }

            const deletedPost = await Post.delete(id);

            res.json({
                mensagem: "post deletado",
                post: deletedPost,
            });
        } catch (erro) {
            res.status(500).json({
                erro: "Erro ao deletar post"
            });
        }
    }
}

// Função para formatar data e hora
function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
    });
}

module.exports = PostController;