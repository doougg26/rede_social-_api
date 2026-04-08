const express = require("express");
const pool = require("./db");
const routes = express.Router();
// Função para formatar data e hora
function formatarData (data){
    return new Date(data).toLocaleString("pt-BR",{
        timeZone:"America/Sao_Paulo",

    });
}

routes.get("/", (req,res) =>{
    res.send("<h1>Rede Social</h1>")
});
// CONSULTA DE USUARIOS
routes.get("/usuarios", async (req, res) =>{
    try {
        const resultado = await pool.query(`
            SELECT * FROM usuarios;
            `);
            //uso sem função de formatar data
        res.json(resultado.rows)
        
    } catch(erro){
        res.status(500).json({erro: "erro ao buscar usuarios"});
    }
});
// CONSULTA DE POSTS
routes.get("/posts", async (req,res)=>{
    try{
        const resultado = await pool.query(`
            SELECT
                usuarios.id,
                usuarios.nome,
                posts.conteudo,
                posts.criado_em
            FROM posts
            JOIN usuarios 
            ON posts.usuario_id = usuarios.id 
            ORDER BY posts.criado_em DESC`);
           //exemplo de uso com função de fromatação de data e hora
           const dados = resultado.rows.map((post)=>({
            ...post,
            criado_em: formatarData(post.criado_em),
           }))
            res.json(dados);

    } catch (erro)
        {
            res.status(500).json({erro: "Erro ao buscar postagens"})
        }
});

// INSERINDO POSTAGEM
routes.post("/posts", async(req,res) =>{
    try{
        const {titulo, conteudo, usuario_id} = req.body;
        const resultado = await pool.query(`
                INSERT INTO posts (titulo, conteudo, usuario_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [titulo, conteudo, usuario_id]);
            res.status(201).json({
                mensagem: "Post Criado com sucesso",
                post: resultado.rows[0],
            });
    } catch(erro){
        res.status(500).json({
            erro:"erro ao criar postagem",
        });
    }
});
// ATUALIZANDO POSTAGEM 
routes.put("/posts/:id", async(req,res)=>{
    try{
        const {id} = req.params;
        const {titulo, conteudo} = req.body;
        const resultado = await pool.query(`
            UPDATE posts
            SET titulo=$1, conteudo =$2
            WHERE id=$3
            RETURNING *
            `,[titulo, conteudo, id], );

            res.status(201).json({
                mensagem: "Post Criado com sucesso",
                post: resultado.rows[0],});
    } catch(erro){
        res.status(500).json({
            erro: "Erro ao atualizar post"
        })
    }
})

// DELETANDO POSTAGEM
    routes.delete("/posts/:id", async(req, res)=>{
       try{
             const {id} = req.params;

            const resultado = await pool.query(`
                DELETE FROM posts 
                WHERE id = $1 
                RETURNING *`,[id],);

                res.status(201).json({
                mensagem: "post deletado",
                post: resultado.rows[0],});
       } catch(erro){
        res.status(500).json({
            erro: "Erro ao deletar post"
        })
       }
            
    })
module.exports = routes;