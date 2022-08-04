const joi = require("joi");

module.exports.newUser = joi.object({
    name:joi.string().required().min(1).max(50),
    email:joi.string().required().email(),
    password:joi.string().required().min(6),
    biz: joi.boolean()
});

module.exports.auth = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required().min(6)
  });