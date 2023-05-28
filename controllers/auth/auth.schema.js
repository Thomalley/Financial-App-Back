const Joi = require('joi');

const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const pre = /^[a-zA-Z0-9]/;

const registerSchema = Joi.object({
  email: Joi.string().min(3).max(255).pattern(new RegExp(re))
    .required(),
  name: Joi.string().min(2).max(255).pattern(new RegExp(pre))
    .required(),
  lastname: Joi.string().min(2).max(255).pattern(new RegExp(pre))
    .required(),
  roleId: Joi.number().max(255).required(),
  phone: Joi.string().min(2).max(255).required(),
  country: Joi.string().min(2).max(255).required(),
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
