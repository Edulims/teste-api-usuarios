import Joi from 'joi'; 

const usuariosSchema = Joi.object({
    quantidade: Joi.number(), // Valida o campo 'quantidade'
    usuarios: Joi.array().items({ // Valida a lista 'usuarios'
        nome: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        administrador: Joi.string(), // A documentação pede string ('true' ou 'false')
        _id: Joi.string()
    })
});

export default usuariosSchema;