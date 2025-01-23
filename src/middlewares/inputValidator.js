import Joi from "joi";

const userScheme = Joi.object({
  logradouro: Joi.string().min(3).required(),
  numero: Joi.string().required(),
  cep: Joi.string().required(),
  cor_equipe: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});


const validateUser = (req, res, next) => {
  const { error } = userScheme.validate(req.params);
  if (error)
    return res.status(400).json({
    status: 400,
    message: error.details[0].message,
  });
  next();
};

export default validateUser;