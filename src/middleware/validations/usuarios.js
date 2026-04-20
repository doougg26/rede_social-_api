const Joi = require('joi');

const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).required().messages({
        "string.empty": "nome é obrigatório",
        "string.min":"nome deve ter pelo menos 3 caracteres",
        "any.require": "nome é obrigatório"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "email é obrigatório",
        "string.email": "email deve ser valido",
        "any.require": "email é obrigatório"
    }),
    senha: Joi.string().min(6).required().messages({
        "string.base": "senha deve ser string",
        "string.empty": "senha é obrigatório",
        "string.min":"senha deve ter pelo menos 6 caracteres",
        "any.require": "senha é obrigatório"
    })
})

function validarUsuarios (req, res, next){
    const {error} = usuarioSchema.validate(req.body, {abortEarly:false});
    if(error){
        console.log(error)
        return res.status(400).json({
            erro: error.details.map(e=> e.message)
        })
    }
    next()
}

module.exports = validarUsuarios;