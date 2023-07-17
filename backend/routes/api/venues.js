const express = require("express");
const { Op } = require("sequelize");
const { requireAuth } = require("./../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("./../../utils/validation");
const {
  Group,
  User,
  GroupImage,
  Venue,
  Event,
  Membership,
  sequelize,
} = require("../../db/models");
const group = require("../../db/models/group");
const router = express.Router();

const validateVenue = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().isAlpha().withMessage("State is required"),
  check("lat").notEmpty().isDecimal().withMessage("Latitude is not valid"),
  check("lng").notEmpty().isDecimal().withMessage("Longitude is not valid"),
  handleValidationErrors,
];

// ! Edit a venue specicified by its Id

router.put("/:venueId", requireAuth, validateVenue, async (req, res, next) => {
  const { address, city, state, lat, lng } = req.body;
  const venue = await Venue.findByPk(req.params.venueId);
  if (!venue) {
    const err = new Error("Venue not found...");
    err.status = 404;
    err.title = "Venue does not exist.";
    return next(err);
  }
  const group = await Group.findByPk(venue.groupId, {
    include: { model: Membership },
    where: {
      id: Membership.groupId,
    },
  });
  const membership = await Membership.findAll({
    where: {
      userId: req.user.id,
    },
  });

  if (group.organizerId !== req.user.id || membership[0].status !== "co-host") {
    const err = new Error("User must be Organizer or Co-Host to access.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }

  venue.set({
    groupId: group.id,
    address,
    city,
    state,
    lat,
    lng,
  });
  await venue.save();
  const resObj = {
    id: venue.id,
    groupId: venue.groupId,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    lat: venue.lat,
    lng: venue.lng,
  };
  return res.json(resObj);
});

module.exports = router;
