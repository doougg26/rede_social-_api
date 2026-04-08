const Joi = require('joi');

const postSchema = Joi.object({
    titulo: Joi.string().min(3).required().messages({
        "string.empty":"Titulo obrigatorio",
        "string.min":"titiulo deve ter pelo menos 3 caracteres",
        "any.require": "titulo é obrigatorio"
    }),
    conteudo: Joi.string().min(5).required().messages({
        "string.empty": "conteudo obrigatório",
        "string.min":"conteudo deve conter ao menos 5 caracteres",
        "any.require":"conteudo obrigatório"
    }),
    usuario_id: Joi.number().integer().required().messages({
        "number.base":"tipo deve ser inteiro",
        "number.empty":"id é obrigatorio",
        "any.require":"id é obrigatorio"
    })
})

function validarPosts (req, res, next){
    const {error} = postSchema.validate(req.body, {abortEarly:false});
    if(error){
        console.log(error)
        return res.status(400).json({
            erro: error.details.map(e=> e.message)
        })
    }
    next()
}

module.exports = validarPosts;