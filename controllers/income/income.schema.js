const Joi = require('joi');

const postIncomeSchema = Joi.object({
  category: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  description: Joi.string().allow(null, ''),
  currency: Joi.string().required(),
});

const putIncomeSchema = Joi.object({
  id: Joi.number().required(),
  used: Joi.boolean().required(),
  category: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  description: Joi.string().allow(null, ''),
  currency: Joi.string().required(),
});

const deleteIncomeSchema = Joi.object({
  incomesIds: Joi.array().min(1).items(Joi.number()),
});

const getIncomeByIdSchema = Joi.object({
  id: Joi.number().required(),
});

const getIncomesPerPageSchema = Joi.object({
  limit: Joi.number().allow(null, ''),
  page: Joi.number().allow(null, ''),
  category: Joi.string().allow(null, ''),
  date: Joi.date().allow(null, ''),
  currency: Joi.string().allow(null, ''),
});

module.exports = {
  putIncomeSchema,
  getIncomeByIdSchema,
  postIncomeSchema,
  deleteIncomeSchema,
  getIncomesPerPageSchema,
};
