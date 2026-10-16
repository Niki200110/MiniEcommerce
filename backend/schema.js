const Joi = require("joi");

module.exports.productSchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(/.*[a-zA-Z].*/)
    .required()
    .messages({
      "string.pattern.base": "Product name must contain at least one letter.",
      "string.empty": "Product name is required.",
      "any.required": "Product name is required.",
    }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a valid number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),

  description: Joi.string().allow("").optional(),

  // image: Joi.string().uri().allow("").optional().messages({
  //   "string.uri": "Please enter a valid image URL.",
  // }),
});
