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
  Membership,
  sequelize,
} = require("../../db/models");
const group = require("../../db/models/group");
const router = express.Router();

const validateGroup = [
  check("name")
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
  handleValidationErrors,
];

const validateVenue = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().isAlpha().withMessage("State is required"),
  check("lat").notEmpty().isDecimal().withMessage("Latitude is not valid"),
  check("lng").notEmpty().isDecimal().withMessage("Longitude is not valid"),
  handleValidationErrors,
];

// Get all groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: Membership,
      },
      {
        model: GroupImage,
      },
    ],
  });

  let groupsArr = [];
  groups.forEach((group) => {
    groupsArr.push(group.toJSON());
  });

  groupsArr.forEach((group) => {
    group.numMembers = group.Memberships.length;

    group.GroupImages.forEach((image) => {
      if (image.preview === true) {
        group.previewImage = image.url;
      } else if (image.preview === false || !image) {
        group.previewImage = "Sorry... No image preview available.";
      }
    });
    delete group.Memberships;
    delete group.GroupImages;
  });

  return res.json({Groups: groupsArr});
});

//Create a group
router.post("/", requireAuth, validateGroup, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const currentUserId = req.user.id;
  const newGroup = await Group.create({
    name,
    organizerId: currentUserId,
    about,
    type,
    private,
    city,
    state,
  });

  return res.json(newGroup);
});

//Get all groups associated with current user
router.get("/current", requireAuth, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const currentUserId = req.user.id;
  const groups = await Group.findAll({
    where: {
      [Op.or]: [
        { organizerId: currentUserId },
        (Membership.userId = currentUserId),
      ],
    },
    include: [
      {
        model: Membership,
      },
      {
        model: GroupImage,
      },
    ],
  });
  let groupsArr = [];
  groups.forEach((group) => {
    groupsArr.push(group.toJSON());
  });
  groupsArr.forEach((group) => {
    group.numMembers = group.Memberships.length;

    group.GroupImages.forEach((image) => {
      if (image.preview === true) {
        group.previewImage = image.url;
      } else if (image.preview === false || !image) {
        group.previewImage = "Sorry... No image preview available.";
      }
    });
    delete group.Memberships;
    delete group.GroupImages;
  });

  res.json(groupsArr);
});

// Get Details of a Group By Id
router.get("/:groupId", async (req, res, next) => {
  const groups = await Group.findAll({
    where: {
      id: req.params.groupId,
    },
    include: [
      {
        model: GroupImage,
        attributes: {
          exclude: ["groupId", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
      },
      {
        model: Membership,
      },
      {
        model: Venue,
      },
    ],
  });

  if (groups.length === 0) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }
  let groupsArr = [];
  groups.forEach((group) => {
    groupsArr.push(group.toJSON());
  });
  groupsArr.forEach((group) => {
    group.numMembers = group.Memberships.length;

    group.Organizer = {
      id: group.User.id,
      firstName: group.User.firstName,
      lastName: group.User.lastName,
    };
    delete group.Memberships;
    // delete group.User;
  });

  const groupObj = {
    id: groupsArr[0].id,
    organizerId: groupsArr[0].organizerId,
    name: groupsArr[0].name,
    about: groupsArr[0].about,
    type: groupsArr[0].type,
    private: groupsArr[0].private,
    city: groupsArr[0].city,
    state: groupsArr[0].state,
    createdAt: groupsArr[0].createdAt,
    updatedAt: groupsArr[0].updatedAt,
    numMembers: groupsArr[0].numMembers,
    GroupImages: groupsArr[0].GroupImages,
    Organizer: groupsArr[0].Organizer,
    Venues: groupsArr[0].Venues,
  };

  res.json(groupObj);
});

//Edit a group
router.put("/:groupId", requireAuth, validateGroup, async (req, res, next) => {
  const { name, about, type, private, city, state } = req.body;
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }
  if (group.organizerId !== req.user.id) {
    const err = new Error("Only the Group Organizer can edit this group.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }
  group.set({
    name,
    about,
    type,
    private,
    city,
    state,
  });
  await group.save();
  res.json(group);
});

//Add an Image to a group based on the group's id
router.post("/:groupId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  const group = await Group.findByPk(req.params.groupId);
  const newImg = GroupImage.build({
    url,
    preview,
    groupId: req.params.groupId,
  });

  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }

  if (group.organizerId !== req.user.id) {
    const err = new Error("Only the Group Organizer can edit this group.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }

  await newImg.validate();
  await newImg.save();

  const img = await GroupImage.findOne({
    where: {
      id: newImg.id,
    },
    attributes: {
      exclude: ["groupId", "createdAt", "updatedAt"],
    },
  });

  res.json(img);
});

//Get all venues for a group specified by its Id
router.get("/:groupId/venues", requireAuth, async (req, res, next) => {
  const venues = await Venue.findAll({
    where: {
      groupId: req.params.groupId,
    },
  });
  const group = await Group.findByPk(req.params.groupId);
  const membership = await Membership.findAll({
    where: {
      userId: req.user.id,
    },
  });
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }
  if (group.organizerId !== req.user.id || membership[0].status !== "co-host") {
    const err = new Error("User must be Organizer or Co-Host to access.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }
  let venuesArr = [];
  venues.forEach((group) => {
    venuesArr.push(group.toJSON());
  });

  res.json({ Venues: venues });
});

//Create a new venue for a group specified by its id
router.post(
  "/:groupId/venues",
  requireAuth,
  validateVenue,
  async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;
    const group = await Group.findByPk(req.params.groupId, {
      include: {
        model: Membership,
      },
      where: {
        id: Membership.groupId,
      },
    });
    const membership = await Membership.findAll({
      where: {
        userId: req.user.id,
      },
    });

    if (!group) {
      const err = new Error("Group not found...");
      err.status = 404;
      err.title = "Group does not exist.";
      return next(err);
    }

    if (
      group.organizerId !== req.user.id ||
      membership[0].status !== "co-host"
    ) {
      const err = new Error("User must be Organizer or Co-Host to access.");
      err.status = 401;
      err.title = "Unauthorized";
      return next(err);
    }

    const newVenue = await Venue.create({
      groupId: req.params.groupId,
      address,
      city,
      state,
      lat,
      lng,
    });
    const newVenueObj = {
      id: newVenue.id,
      groupId: Number(newVenue.groupId),
      address,
      city,
      state,
      lat,
      lng,
    };
    return res.json(newVenueObj);
  }
);

//Delete a group
router.delete("/:groupId", requireAuth, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }
  if (group.organizerId !== req.user.id) {
    const err = new Error("Only the Group Organizer can delete this group.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }
  group.destroy();
  return res.json({ message: "success" });
});

module.exports = router;
