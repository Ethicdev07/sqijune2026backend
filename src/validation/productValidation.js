const joi = require("joi");

const  validateProduct = (object) => {
    const schema = joi.object().keys({
        title: joi
            .string()
            .required()
            .error(new Error("Please provide title")),
        description: joi
            .string()
            .required()
            .error(new Error("Please provide description")),
        price: joi
            .number()
            .required()
            .error(new Error("Please provide price")),
        stock: joi
            .number()
            .required()
            .error(new Error("Please provide stock")),
        instock: joi
            .boolean()
            .optional()
            .default(true),
    });
    return schema.validate(object);
};

module.exports = { validateProduct }