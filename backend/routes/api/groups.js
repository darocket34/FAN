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
  EventImage,
  Attendance,
  Event,
  sequelize,
} = require("../../db/models");
const group = require("../../db/models/group");
const user = require("../../db/models/user");
const router = express.Router();

const validateGroup = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Please select an option"),
  check("city")
    .notEmpty()
    .withMessage("City is required. Please use format 'City, State'"),
  check("state")
    .notEmpty()
    .withMessage("State is required. Please use format 'City, State'"),
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

const validateEvent = [
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In Person"])
    .withMessage("Type must be 'Online' or 'In Person'"),
  check("price").isDecimal().withMessage("Price is invalid"),
  check("description").notEmpty().withMessage("Description is required"),
  check("startDate").isAfter().withMessage("Start date must be in the future"),
  check("endDate")
    .custom((value, { req }) => value > req.body.startDate)
    .withMessage("End date is less than start date"),
  handleValidationErrors,
];

// ! Get all groups

router.get("/", async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: Membership,
        // where: {
        //   status: {
        //     [Op.in]: ['member', 'co-host']
        //   }
        // }
      },
      {
        model: GroupImage,
      },
      {
        model: User,
      },
      {
        model: Event,
      },
    ],
  });

  let groupsArr = [];
  groups.forEach((group) => {
    groupsArr.push(group.toJSON());
  });

  groupsArr.forEach((group) => {
    let count = 0;
    group.Memberships.forEach((membership) => {
      if (membership.status === "member" || membership.status === "co-host") {
        count++;
      }
    });
    group.numMembers = count;

    group.GroupImages.forEach((image) => {
      if (image.preview === true) {
        group.previewImage = image.url;
      }
    });
    delete group.Memberships;
    delete group.GroupImages;
  });
  if (!group.previewImage) {
    group.previewImage = "Sorry... No image preview available.";
  }
  return res.json({ allGroups: groupsArr });
});

// ! Create a group

router.post("/", requireAuth, validateGroup, async (req, res, next) => {
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

  await Membership.create({
    userId: req.user.id,
    groupId: newGroup.id,
    status: "co-host",
  });
  return res.json(newGroup);
});

// ! Get all groups associated with current user

router.get("/current", requireAuth, async (req, res) => {
  const currentUserId = req.user.id;
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
    if (group.toJSON().organizerId === currentUserId) {
      groupsArr.push(group.toJSON());
    } else {
      group.toJSON().Memberships.forEach((member) => {
        if (member.userId === currentUserId) {
          groupsArr.push(group.toJSON());
        }
      });
    }
  });

  groupsArr.forEach((group) => {
    group.numMembers = group.Memberships.length;

    group.GroupImages.forEach((image) => {
      if (image.preview === true) {
        group.previewImage = image.url;
      }
    });
    delete group.Memberships;
    delete group.GroupImages;
  });
  if (!group.previewImage) {
    group.previewImage = "Sorry... No image preview available.";
  }
  if (groupsArr.length === 0) {
    return res.status(404).json({
      message: "No groups found for user",
    });
  }

  return res.json({ Groups: groupsArr });
});

// ! Get Details of a Group By Id

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
        model: Membership,
      },
      {
        model: Venue,
      },
      {
        model: Event,
        include: [{ model: EventImage }],
      },
    ],
  });

  if (groups.length === 0) {
    res.status(404).json({
      message: "Group couldn't be found",
    });
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
    Events: groupsArr[0].Events,
  };

  return res.json(groupObj);
});

// ! Edit a group

router.put(
  "/:groupId/edit",
  requireAuth,
  validateGroup,
  async (req, res, next) => {
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
    return res.json(group);
  }
);

// ! Add an Image to a group based on the group's id

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

  return res.json(img);
});

// ! Get all venues for a group specified by its Id

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
      groupId: req.params.groupId,
    },
  });
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }

  if (membership.length > 0) {
    if (membership[0].status === "co-host") {
      let venuesArr = [];
      venues.forEach((group) => {
        venuesArr.push(group.toJSON());
      });
      return res.json({ Venues: venues });
    } else {
      const err = new Error("User must be Organizer or Co-Host to access.");
      err.status = 401;
      err.title = "Unauthorized";
      return next(err);
    }
  } else if (group.organizerId === req.user.id) {
    let venuesArr = [];
    venues.forEach((group) => {
      venuesArr.push(group.toJSON());
    });
    return res.json({ Venues: venues });
  } else {
    const err = new Error("User must be Organizer or Co-Host to access.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }
});

// ! Create a new venue for a group specified by its id

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
        groupId: req.params.groupId,
      },
    });

    if (!group) {
      const err = new Error("Group not found...");
      err.status = 404;
      err.title = "Group does not exist.";
      return next(err);
    }

    if (membership.length > 0) {
      if (membership[0].status === "co-host") {
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
      } else {
        const err = new Error("User must be Organizer or Co-Host to access.");
        err.status = 401;
        err.title = "Unauthorized";
        return next(err);
      }
    } else if (group.organizerId === req.user.id) {
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
    } else {
      const err = new Error("User must be Organizer or Co-Host to access.");
      err.status = 401;
      err.title = "Unauthorized";
      return next(err);
    }
  }
);

// ! Get all events of a group specified by its id

router.get("/:groupId/events", async (req, res, next) => {
  const events = await Event.findAll({
    where: {
      groupId: req.params.groupId,
    },
    include: [
      {
        model: Group,
        attributes: {
          exclude: [
            "organizerId",
            "about",
            "type",
            "private",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: Venue,
        attributes: {
          exclude: [
            "groupId",
            "address",
            "lat",
            "lng",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: EventImage,
      },
      {
        model: Attendance,
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  if (events.length === 0) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }
  let eventsRes = [];
  events.forEach((event) => {
    event.EventImages.forEach((image) => {
      if (image.preview === true) {
        event.previewImage = image.url;
      }
    });
    if (!event.previewImage) {
      event.previewImage = "Sorry... No image preview available.";
    }
    eventsRes.push({
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: event.Attendances.length,
      previewImage: event.previewImage,
      Group: event.Group,
      Venue: event.Venue,
    });
    delete event.EventImages;
  });
  return res.json({ Events: eventsRes });
});

// ! Create an Event for a Group specified by its id

router.post(
  "/:groupId/events",
  requireAuth,
  validateEvent,
  async (req, res, next) => {
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;
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

    const venue = await Venue.findByPk(venueId);
    if (venue === null && venueId !== undefined) {
      const err = Error("Venue does not exist");
      err.status = 404;
      err.title = "Bad request.";
      return next(err);
    }
    if (!group) {
      const err = new Error("Group not found...");
      err.status = 404;
      err.title = "Group does not exist.";
      return next(err);
    }

    if (group.organizerId !== req.user.id || membership === undefined) {
      const err = new Error("User must be Organizer or Co-Host to access.");
      err.status = 401;
      err.title = "Unauthorized";
      return next(err);
    }

    const newEvent = await Event.create({
      groupId: Number(req.params.groupId),
      venueId: venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });
    const eventRes = {
      id: newEvent.id,
      groupId: newEvent.groupId,
      venueId: venueId,
      name: newEvent.name,
      type: newEvent.type,
      capacity: newEvent.capacity,
      price: newEvent.price,
      description: newEvent.description,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
    };

    await Attendance.create({
      eventId: newEvent.id,
      userId: req.user.id,
      status: "attending",
    });
    return res.json(eventRes);
  }
);

// ! Get all members of a group specified by its id
router.get("/:groupId/members", async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }
  const membersAll = await User.findAll({
    include: {
      model: Membership,
      as: "Membership",
      where: {
        groupId: req.params.groupId,
      },
      scope: ["statusOnly"],
      attributes: ["status"],
    },
    attributes: {
      include: ["id", "firstName", "lastName"],
      exclude: ["username"],
    },
  });

  const membersHostOnly = await User.findAll({
    include: {
      model: Membership,
      as: "Membership",
      where: {
        groupId: req.params.groupId,
        status: {
          [Op.in]: ["co-host", "member"],
        },
      },
      scope: ["statusOnly"],
      attributes: ["status"],
    },
    attributes: {
      include: ["id", "firstName", "lastName"],
      exclude: ["username"],
    },
  });

  const membersHostOnlyRes = membersHostOnly.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    Membership: {
      status: user.Membership[0].status,
    },
  }));

  if (!req.user) {
    return res.json({ Members: membersHostOnlyRes });
  }

  let roleCheck = "";
  let resArr = [];
  let userArr = [];

  membersAll.forEach((member) => {
    userArr.push(member.toJSON());
  });

  userArr.forEach((member) => {
    let status = member.Membership[0].status;
    if (member.id === req.user.id && status === "co-host") {
      roleCheck = "host";
    }
    resArr.push(member);
  });

  const membersAllRes = resArr.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    Membership: {
      status: user.Membership[0].status,
    },
  }));

  if (roleCheck === "host") {
    return res.json({ Members: membersAllRes });
  } else {
    return res.json({ Members: membersHostOnlyRes });
  }
});

// ! Request a membership for a group based on the Group's Id
router.post("/:groupId/membership", requireAuth, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }
  const memberList = await Membership.findAll({
    where: {
      groupId: req.params.groupId,
    },
  });
  let memberListArr = [];
  memberList.forEach((member) => {
    memberListArr.push(member.toJSON());
  });

  let statusCheck = "";

  memberListArr.forEach((member) => {
    if (member.userId === req.user.id && member.status === "pending") {
      statusCheck = "pending";
    }
    if (
      member.userId === req.user.id &&
      (member.status === "member" || member.status === "co-host")
    ) {
      statusCheck = "member";
    }
  });

  if (statusCheck === "pending") {
    const err = new Error("Membership has already been requested");
    err.status = 400;
    err.title = "Request Denied";
    return next(err);
  } else if (statusCheck === "member") {
    const err = new Error("User is already a member of the group");
    err.status = 400;
    err.title = "Request Denied";
    return next(err);
  } else if (statusCheck === "") {
    const newMember = await Membership.create({
      userId: req.user.id,
      groupId: req.params.groupId,
      status: "pending",
    });

    const resObj = {
      memberId: req.user.id,
      status: newMember.status,
    };
    return res.json(resObj);
  }
});

// ! Change the status of a membership for a group specified by id

router.put("/:groupId/membership", requireAuth, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }

  const { memberId, status } = req.body;
  if (status === "pending") {
    const err = new Error("Cannot change a membership status to pending");
    err.status = 400;
    err.title = "Validation Error";
    return next(err);
  }

  const membership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: memberId,
    },
  });
  if (!membership) {
    const err = new Error(
      "Membership between the user and the group does not exist"
    );
    err.status = 404;
    return next(err);
  }

  const memberList = await Membership.findAll({
    where: {
      groupId: req.params.groupId,
    },
  });

  const user = await User.findByPk(memberId);
  if (!user) {
    const err = new Error("User couldn't be found");
    err.status = 400;
    err.title = "Validation Error";
    return next(err);
  }

  let memberListArr = [];
  memberList.forEach((member) => {
    memberListArr.push(member.toJSON());
  });

  let statusCheck = "";

  memberListArr.forEach((member) => {
    if (
      member.userId === req.user.id &&
      member.status === "co-host" &&
      status === "member"
    ) {
      statusCheck = "co-host";
    } else if (
      (member.userId === req.user.id && member.status === "member") ||
      (member.userId === req.user.id && member.status === "pending")
    ) {
      statusCheck = "member";
    } else if (member.userId === memberId && member.status === "co-host") {
      statusCheck = "nochange";
    }
  });
  if (req.user.id === group.organizerId) {
    statusCheck = "organizer";
  }

  if (statusCheck === "member") {
    const err = new Error(
      "Only the Organizer or Co-Host can change a membership"
    );
    err.status = 400;
    err.title = "Validation Error";
    return next(err);
  } else if (statusCheck === "co-host" && status === "member") {
    const err = new Error("Only the Organizer can change a Co-Host membership");
    err.status = 403;
    err.title = "Validation Error";
    return next(err);
  } else if (statusCheck === "co-host" && status === "co-host") {
    const err = new Error("Only the Group Organizer grant Co-Host status");
    err.status = 403;
    err.title = "Validation Error";
    return next(err);
  }

  if (statusCheck === "organizer") {
    const updatedMember = await membership.set({
      groupId: req.params.groupId,
      status: status,
    });
    updatedMember.save();
    const resObj = {
      id: updatedMember.id,
      groupId: Number(req.params.groupId),
      memberId: updatedMember.userId,
      status: updatedMember.status,
    };
    return res.json(resObj);
  }

  if (statusCheck === "co-host" && status === "member") {
    const updatedMember = await membership.set({
      groupId: req.params.groupId,
      status: status,
    });
    updatedMember.save();
    const resObj = {
      id: updatedMember.id,
      groupId: Number(req.params.groupId),
      memberId: updatedMember.userId,
      status: updatedMember.status,
    };
    return res.json(resObj);
  }
});

// ! Delete membership to a group specified by id
router.delete("/:groupId/membership", requireAuth, async (req, res, next) => {
  const { memberId } = req.body;
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }
  const user = await User.findByPk(memberId);
  if (!user) {
    const err = new Error("User couldn't be found");
    err.status = 400;
    err.title = "Validation Error";
    return next(err);
  }
  const membership = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: memberId,
    },
  });
  if (!membership) {
    const err = new Error(
      "Membership between the user and the group does not exist"
    );
    err.status = 404;
    return next(err);
  }

  if (req.user.id === memberId || req.user.id === group.organizerId) {
    await membership.destroy();
    return res.json({
      message: "Successfully deleted membership from group",
    });
  } else {
    const err = new Error(
      "Only the Organizer can delete memberships of other users"
    );
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }
});

// ! Delete a group

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
  await group.destroy();
  return res.json({ message: "success" });
});

module.exports = router;
