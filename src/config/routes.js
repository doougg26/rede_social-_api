require("dotenv").config();
const express = require("express");
const pool = require("./db");
const validarUsuarios = require("../validation/usuarios")
const validarPosts = require("../validation/posts")
const routes = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../auth/authLogin")
const bcrypt = require("bcrypt");

// Função para formatar data e hora
function formatarData (data){
    return new Date(data).toLocaleString("pt-BR",{
        timeZone:"America/Sao_Paulo",

    });
}

//INSERINDO USUARIO
routes.post("/usuarios", validarUsuarios, async (req, res)=>{
    try{
        const {nome, email, senha } = req.body;
        const senhaHash = await bcrypt.hash(senha, 10)

        const resultado = await pool.query(`
            INSERT INTO usuarios (nome, email, senha)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [nome, email, senhaHash]
        );
        res.status(201).json({
            mensagem:"usuario criado com sucesso",
            usuario: resultado.rows[0]
        })
    } catch(erro){
        res.status(500).json({erro: "Erro ao criar usuario" })
    }
});
//Login

routes.post("/login", async (req, res)=>{
const {email, senha} = req.body;
    
    const usuario = await pool.query(`
    SELECT * FROM usuarios
    WHERE email=$1
    `, [email])
    
    if(usuario.rows.length ===0){
        return res.status(400).json({
            mensagem:"usuario não encontrado"
        })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

    if(!senhaValida){
        return res.status(400).json({
            mensagem:"senha inválida"
        })
    }
    const token = jwt.sign({id: usuario.rows[0].id}, process.env.JWT_SECRET,{
        expiresIn: "1h"
    });

    res.json({token})
});

routes.get("/", (req,res) =>{
    res.send("<h1>Rede Social</h1> <p>Bem-vindo à nossa API de rede social! Aqui você pode criar uma conta, fazer login e compartilhar suas postagens com outros usuários. Explore as funcionalidades e conecte-se com amigos!</p> <p> documentação <a href='https://documenter.getpostman.com/view/43110445/2sBXitC7Qc'> aqui </a></p>")
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
            usuarios.id AS usuarios_id,
            usuarios.nome,
            posts.conteudo,
            posts.titulo,
            posts.criado_em,
            posts.id AS post_id
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
routes.post("/posts", auth, validarPosts, async(req,res) =>{
    try{
        const {titulo, conteudo} = req.body;
        const resultado = await pool.query(`
                INSERT INTO posts (titulo, conteudo, usuario_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [titulo, conteudo, req.usuario.id]);
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
routes.put("/posts/:id", auth, validarPosts, async(req,res)=>{
    try{
        const {id} = req.params;
        const {titulo, conteudo} = req.body;

        const post = await pool.query(`
            SELECT * FROM posts
            WHERE id=$1
            `,[id]);

            if(post.rows.length ===0){
        return res.status(404).json({
            mensagem:"post não encontrado"
        })
    };
        if (post.rows[0].usuario_id !== req.usuario.id){
            return res.status(403).json({
                mensagem:"sem permissão"
            })
        }


        const resultado = await pool.query(`
            UPDATE posts
            SET titulo=$1, conteudo=$2
            WHERE id=$3
            RETURNING *
            `,[titulo, conteudo, id], );

            res.status(200).json({
                mensagem: "Post Atualizado com sucesso",
                post: resultado.rows[0],});
    } catch(erro){
        res.status(500).json({
            erro: "Erro ao atualizar post"
        })
    }
})

// DELETANDO POSTAGEM
    routes.delete("/posts/:id", auth, async(req, res)=>{
       try{
             const {id} = req.params;
           const post = await pool.query(`
            SELECT * FROM posts
            WHERE id=$1
            `, [id]);
           if (post.rows.length === 0) {
               return res.status(404).json({
                   mensagem: "post não encontrado"
               })
           };
           if (post.rows[0].usuario_id !== req.usuario.id) {
               return res.status(403).json({
                   mensagem: "sem permissão"
               })
           }
            const resultado = await pool.query(`
                DELETE FROM posts 
                WHERE id=$1 
                RETURNING *`,[id],);

                res.json({
                mensagem: "post deletado",
                post: resultado.rows[0],});
       } catch(erro){
        res.status(500).json({
            erro: "Erro ao deletar post"
        })
       }
            
    })
module.exports = routes;