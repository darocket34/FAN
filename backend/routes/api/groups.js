const express = require("express");
const { Op, literal } = require("sequelize");
const { requireAuth } = require("./../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("./../../utils/validation");
const {
  Group,
  User,
  GroupImage,
  Event,
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

// Get all groups
router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
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
    group.User = [group.User];
    group.User.forEach((user) => {
      let count = 0;
      if (user) count++;
      group.numMembers = count;
    });
    group.GroupImages.forEach((image) => {
      if (image.preview === true) {
        group.previewImage = image.url;
      } else if (image.preview === false || !image) {
        group.previewImage = "Sorry... No image preview available.";
      }
    });
    delete group.User;
    delete group.GroupImages;
  });

  return res.json(groupsArr);
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
        model: User,
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
    group.User = [group.User];
    group.User.forEach((user) => {
      let count = 0;
      if (user) count++;
      group.numMembers = count;
    });
    group.GroupImages.forEach((image) => {
      if (image.preview === true) {
        group.previewImage = image.url;
      } else if (image.preview === false || !image) {
        group.previewImage = "Sorry... No image preview available.";
      }
    });
    delete group.User;
    delete group.GroupImages;
  });

  res.json(groupsArr);
});

router.get("/:groupId", async (req, res) => {
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
        model: Venue,
        // attributes: {
        // exclude: ["createdAt", "updatedAt"],
        // }
      },
    ],
  });

  let groupsArr = [];
  groups.forEach((group) => {
    groupsArr.push(group.toJSON());
  });
  groupsArr.forEach((group) => {
    group.User = [group.User];
    group.User.forEach((user) => {
      let count = 0;
      if (user) count++;
      group.numMembers = count;
    });
    group.Organizer = {
      id: group.User[0].id,
      firstName: group.User[0].firstName,
      lastName: group.User[0].lastName,
    };
    delete group.User;
  });
  console.log(groupsArr[0].name);
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

module.exports = router;
