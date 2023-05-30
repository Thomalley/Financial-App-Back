const Joi = require('joi');

const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const pre = /^[a-zA-Z0-9]/;

const registerSchema = Joi.object({
  email: Joi.string()
    .min(3)
    .max(255)
    .pattern(new RegExp(re))
    .required(),
  name: Joi.string()
    .required(),
  lastname: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(3).max(255).pattern(new RegExp(re))
    .required(),
  password: Joi.string().pattern(new RegExp(pre)).required(),
});

const verificationSchema = Joi.object({
  password: Joi.string().pattern(new RegExp(pre)).required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .error(new Error('Las contraseñas no coinciden')),
  token: Joi.string(),
});

module.exports = {
  registerSchema,
  loginSchema,
  verificationSchema,
};
