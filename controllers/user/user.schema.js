const Joi = require('joi');

const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const pre = /^[a-zA-Z0-9]/;

const registerSchema = Joi.object({
  email: Joi.string().min(3).max(255).pattern(new RegExp(re))
    .required(),
  name: Joi.string().required(),
  lastname: Joi.string().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(3).max(255).pattern(new RegExp(re))
    .required(),
  password: Joi.string().pattern(new RegExp(pre)).required(),
});

const putUserSchema = Joi.object({
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
  putUserSchema,
  getUserByIdSchema,
  registerSchema,
  loginSchema,
};
