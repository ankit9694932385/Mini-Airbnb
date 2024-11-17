const joi = require("joi");
const review = require("./models/review");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      country: joi.string().required(),
      location: joi.string().required(),
      image: joi.string().allow("", null),
      price: joi.number().required().min(0),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      comment: joi.string().required(),
      rating: joi.number().required().min(0).max(5),
    })
    .required(),
});
