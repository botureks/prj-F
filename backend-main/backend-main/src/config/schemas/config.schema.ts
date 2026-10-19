import Joi from 'joi';

export const validationSchema = Joi.object({
  APP_ID: Joi.string().required(),
  DOMAIN: Joi.string().required(),
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  JWT_ACCESS_TIME: Joi.number().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TIME: Joi.number().required(),
  REFRESH_COOKIE: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  UPLOAD_MAX_FILE_SIZE: Joi.number().required(),
  UPLOAD_MAX_FILES: Joi.number().required(),
  STORAGE_ACCESS_KEY: Joi.string().required(),
  STORAGE_SECRET_KEY: Joi.string().required(),
  STORAGE_ENDPOINT: Joi.string().required(),
  STORAGE_PUBLIC_ENDPOINT: Joi.string().required()
});
