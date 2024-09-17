const Joi = require('joi');

const taskSchemaValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    dueDate: Joi.date().greater('now').required(),
    completed: Joi.boolean()
});

exports.validateTaskForm = (data) => taskSchemaValidator.validate(data);