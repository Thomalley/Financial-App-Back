const Joi = require('joi');

const postIncomeSchema = Joi.object({
  category: Joi.string()
    .required(),
  amount: Joi.number()
    .required(),
  date: Joi.date()
    .required(),
  used: Joi.boolean()
    .required(),
  description: Joi.string(),
  currency: Joi.string()
    .required(),
});

const putIncomeSchema = Joi.object({
  id: Joi.number().required(),
  category: Joi.string().required(),
  amount: Joi.number()
    .required(),
  date: Joi.date()
    .required(),
  used: Joi.boolean()
    .required(),
  description: Joi.string(),
  currency: Joi.string()
    .required(),
});

const deleteIncomeSchema = Joi.object({
  incomesIds: Joi.array().min(1).items(Joi.number()),
});

const getIncomeByIdSchema = Joi.object({
  id: Joi.number().required(),
});

const getIncomesPerPageSchema = Joi.object({
  limit: Joi.number().required(),
  page: Joi.number().required(),
  searchValue: Joi.string().allow(''),
});
module.exports = {
  putIncomeSchema,
  getIncomeByIdSchema,
  postIncomeSchema,
  deleteIncomeSchema,
  getIncomesPerPageSchema,
};
