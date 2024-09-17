const Joi = require('joi');

const registerSchemaValidator = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required()
});

exports.validateRegisterForm = (data) => registerSchemaValidator.validate(data);