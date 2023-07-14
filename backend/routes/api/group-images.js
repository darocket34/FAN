const express = require("express");
const { Op } = require("sequelize");
const { requireAuth } = require("./../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("./../../utils/validation");
const {
  Group,
  User,
  EventImage,
  GroupImage,
  Venue,
  Event,
  Membership,
  Attendance,
  sequelize,
} = require("../../db/models");
const user = require("../../db/models/user");
const router = express.Router();

// ! Delete an image for a group
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const image = await GroupImage.findByPk(req.params.imageId, {
    include: {
      model: Group,
      include: {
        model: Membership,
        where: {
          userId: req.user.id,
        },
      },
    },
  });
  if (!image) {
    const err = new Error("Image not found...");
    err.status = 404;
    err.title = "Image does not exist.";
    return next(err);
  }

  if (
    req.user.id !== image.Group.organizerId ||
    image.Group.Memberships[0].status !== "co-host"
  ) {
    const err = new Error(
      "Only the Organizer or Co-Host can remove images"
    );
    err.status = 400;
    err.title = "Validation Error";
    return next(err);
  } else {
    await image.destroy();
    res.json({
      message: "Successfully Completed",
    });
  }
});

module.exports = router;
