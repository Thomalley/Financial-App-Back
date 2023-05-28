const Joi = require('joi');
const { USER, SUPER_ADMIN } = require('../../misc/const/user_types');

const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const pre = /^[a-zA-Z0-9]/;

const createSchema = Joi.object({
  email: Joi.string()
    .min(3)
    .max(255)
    .pattern(new RegExp(re))
    .required(),
  name: Joi.string()
    .min(2)
    .max(255)
    .pattern(new RegExp(pre))
    .required(),
  lastname: Joi.string()
    .min(2)
    .max(255)
    .pattern(new RegExp(pre))
    .required(),
  password: Joi.string()
    .pattern(new RegExp(pre))
    .required(),
  roleId: Joi.string()
    .allow(
      USER,
      SUPER_ADMIN,
    ),
  phone: Joi.string()
    .min(2)
    .max(255)
    .required(),
  country: Joi.string()
    .min(2)
    .max(255)
    .required(),
});

const updateUserSchema = Joi.object({
  id: Joi.number().required(),
  updatedStatus: Joi.boolean(),
  updatedRole: Joi.string()
    .allow(
      USER,
      SUPER_ADMIN,
    ),

});

const getUsersPerPageSchema = Joi.object({
  limit: Joi.number().required(),
  page: Joi.number().required(),
  searchValue: Joi.string().allow(''),
  condition: Joi.string().allow(''),
  query: Joi.string().allow(''),
  requiredExperience: Joi.string().allow(''),
});

const getFilteredUsersSchema = Joi.object({
  query: Joi.string().required(),
  requiredExperience: Joi.string().required(),
});

const editUserSchema = Joi.object({
  id: Joi.number().required(),
  active: Joi.boolean(),
  email: Joi.string()
    .min(3)
    .max(255)
    .pattern(new RegExp(re))
    .required(),
  name: Joi.string()
    .min(2)
    .max(255)
    .pattern(new RegExp(pre))
    .required(),
  lastname: Joi.string()
    .min(2)
    .max(255)
    .pattern(new RegExp(pre))
    .required(),

  roleId: Joi.number()
    .required(),
  phone: Joi.string()
    .min(2)
    .max(255)
    .required(),
  country: Joi.string()
    .min(2)
    .max(255)
    .required(),
});

const getUserByIdSchema = Joi.object({
  id: Joi.number().required(),
});

const getUserByRoleSchema = Joi.object({
  roleId: Joi.number().required(),
});

module.exports = {
  updateUserSchema,
  getUsersPerPageSchema,
  getFilteredUsersSchema,
  createSchema,
  editUserSchema,
  getUserByIdSchema,
  getUserByRoleSchema,
};
