const Joi = require('joi');

const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const editUserSchema = Joi.object({
  id: Joi.number().required(),
  active: Joi.boolean().required(),
  email: Joi.string()
    .min(3)
    .max(255)
    .pattern(new RegExp(re))
    .required(),
  name: Joi.string()
    .required(),
  lastname: Joi.string()
    .required(),
  deleted: Joi.boolean()
    .required(),
});

const getUserByIdSchema = Joi.object({
  id: Joi.number().required(),
});

module.exports = {
  editUserSchema,
  getUserByIdSchema,
};
