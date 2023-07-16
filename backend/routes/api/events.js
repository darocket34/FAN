const express = require("express");
const { Op } = require("sequelize");
const { requireAuth } = require("./../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
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

const validateEvent = [
  check("venueId").exists().withMessage("Venue does not exist"),
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In Person"])
    .withMessage("Type must be 'Online' or 'In Person'"),
  check("capacity").isInt().withMessage("Capacity must be an integer"),
  check("price").isDecimal().withMessage("Price is invalid"),
  check("description").notEmpty().withMessage("Description is required"),
  check("startDate").isAfter().withMessage("Start date must be in the future"),
  check("endDate")
    .custom((end, { req }) => end > req.body.startDate)
    .withMessage("End date is less than start date"),
  handleValidationErrors,
];

const validateParameters = [
  check("page")
    .optional()
    .isInt({ min: 1 }, { max: 10 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20"),
  check("name").optional().isString().withMessage("Name must be a string"),
  // check("type")
  //   .optional()
  //   .isIn(["Online", "In Person"])
  //   .withMessage("Type must be 'Online' or 'In Person'"),
  check("startDate")
    .optional()
    .isDate()
    .withMessage("Start date must be a valid datetime"),
  handleValidationErrors,
];

// ! Get all events

router.get("/", validateParameters, async (req, res) => {
  let query = {
    where: {},
  };

  const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
  const size = req.query.size === undefined ? 20 : parseInt(req.query.size);

  if (page >= 1 && size >= 1) {
    query.limit = size;
    query.offset = size * (page - 1);
  }
  if (req.query.name) {
    query.where.name = req.query.name;
    query.where.name = { [Op.like]: `%${req.query.name}%` };
  }
  if (req.query.type) {
    query.where.type = req.query.type;
  }
  if (req.query.startDate) {
    query.where.startDate = req.query.startDate;
  }

  const events = await Event.findAll({
    ...query,
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
  });

  let eventsRes = [];
  for (let event of events) {
    let attendees = await Attendance.count({
      where: { status: "attending", eventId: event.id },
    });
    event.EventImages.forEach((image) => {
      if (image.preview === true) {
        event.previewImage = image.url;
      } else if (image.preview === false || !image) {
        event.previewImage = "Sorry... No image preview available.";
      }
    });
    eventsRes.push({
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: attendees,
      previewImage: event.previewImage,
      Group: event.Group,
      Venue: event.Venue,
    });
    delete event.EventImages;
  }

  res.json({ Events: eventsRes });
});

// ! Get details of an event specified by its id

router.get("/:eventId", async (req, res, next) => {
  const events = await Event.findAll({
    where: {
      id: req.params.eventId,
    },
    include: [
      {
        model: Group,
        attributes: {
          exclude: ["organizerId", "about", "type", "createdAt", "updatedAt"],
        },
      },
      {
        model: Venue,
        attributes: {
          exclude: ["groupId", "createdAt", "updatedAt"],
        },
      },
      {
        model: EventImage,
        attributes: {
          exclude: ["eventId", "groupId", "createdAt", "updatedAt"],
        },
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
    eventsRes.push({
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      description: event.description,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
      startDate: event.startDate,
      endDate: event.endDate,
      numAttending: event.Attendances.length,
      Group: event.Group,
      Venue: event.Venue,
      EventImages: event.EventImages,
    });
    delete event.EventImages;
  });
  res.json({ Events: eventsRes });
});

// ! Add an image to an event based on the event's id

router.post("/:eventId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  if (!url) {
    const err = new Error("Image not found...");
    err.status = 400;
    err.title = "Please enter valid image url.";
    return next(err);
  }
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: Attendance,
      },
      {
        model: Group,
      },
    ],
  });
  if (!event) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }
  const currUser = req.user.id;
  let confirm = false;

  event.Attendances.forEach(async (attendee) => {
    const attendeeId = attendee.userId;
    const attendeeStatus = attendee.status;
    if (currUser === attendeeId && attendeeStatus === "attending") {
      confirm = true;
    }
  });

  if (confirm) {
    const newEventImg = await event.createEventImage({
      eventId: req.params.eventId,
      url,
      preview,
    });
    const resObj = {
      id: newEventImg.id,
      url,
      preview,
    };
    return res.json(resObj);
  } else {
    const err = new Error("Only an attendee can edit this group.");
    err.status = 401;
    err.title = "Unauthorized";
    next(err);
  }
});

// ! Edit an event specified by Id

router.put("/:eventId", requireAuth, validateEvent, async (req, res, next) => {
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
  const event = await Event.findByPk(req.params.eventId, {
    include: {
      model: Group,
      include: {
        model: Membership,
      },
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  if (!event) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }

  const venue = await Venue.findByPk(venueId);

  if (venue === null && venueId !== undefined) {
    const err = Error("Venue does not exist");
    err.status = 404;
    err.title = "Bad request.";
    return next(err);
  }

  const currUser = req.user.id;

  let confirm = false;

  event.Group.Memberships.forEach(async (member) => {
    const memberId = member.userId;
    const memberStatus = member.status;
    if (currUser === memberId && memberStatus === "co-host") {
      confirm = true;
    }
  });

  if (confirm) {
    event.set({
      groupId: event.groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    event.save();

    const resObj = {
      id: event.id,
      groupId: event.groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    };
    return res.json(resObj);
  } else {
    const err = new Error("User must be Organizer or Co-Host to access.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }
});

// ! Get all attendees of an event specified by id

router.get("/:eventId/attendees", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: {
      model: Group,
    },
  });
  if (!event) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }

  const group = await Group.findOne({
    inlcude: {
      model: Membership,
    },
    where: {
      id: event.groupId,
    },
  });
  if (!group) {
    const err = new Error("Group not found...");
    err.status = 404;
    err.title = "Group does not exist.";
    return next(err);
  }

  const membership = await Membership.findAll({
    where: {
      groupId: group.id,
    },
  });

  const organizer = event.Group.organizerId;
  const fullView = false;

  const attendees = await Attendance.findAll({
    where: {
      eventId: req.params.eventId,
    },
    include: {
      model: User,
      attributes: {
        include: ["firstName", "lastName"],
        exclude: [
          "hashedPassword",
          "username",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "userId", "eventId"],
    },
  });

  const attendeesNoPending = await Attendance.findAll({
    where: {
      eventId: req.params.eventId,
      [Op.not]: {
        status: "pending",
      },
    },
    include: {
      model: User,
      attributes: {
        include: ["firstName", "lastName"],
        exclude: [
          "hashedPassword",
          "username",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "userId", "eventId"],
    },
  });

  let attendeesResArr = [];
  let attendeesNoPendingResArr = [];
  attendees.forEach((attendee) => {
    attendeesResArr.push({
      id: attendee.User.id,
      firstName: attendee.User.firstName,
      lastName: attendee.User.lastName,
      Attendance: {
        status: attendee.status,
      },
    });
  });

  attendeesNoPending.forEach((attendee) => {
    attendeesNoPendingResArr.push({
      id: attendee.User.id,
      firstName: attendee.User.firstName,
      lastName: attendee.User.lastName,
      Attendance: {
        status: attendee.status,
      },
    });
  });

  if (!req.user) res.json(attendeesNoPendingResArr);

  let membershipArr = [];
  membership.forEach((membership) => {
    membershipArr.push(membership.toJSON());
  });

  membershipArr.forEach((membership) => {
    if (membership.userId === req.user.id && membership.status === "cohost") {
      fullView = true;
    }
  });

  if (organizer === req.user.id || fullView) {
    res.json(attendeesResArr);
  } else {
    res.json(attendeesNoPendingResArr);
  }
});

// ! Request to attend an event based on the event Id

router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  // const { userId, status } = req.body;
  // const statusArr = ["waitlist", "pending", "attending"];
  // if (!statusArr.includes(status)) {
  //   const err = new Error(
  //     "Status must be 'pending', 'waitlist', or 'attending'."
  //   );
  //   err.status = 400;
  //   err.title = "Bad request.";
  //   return next(err);
  // }
  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    const err = new Error("Please login");
    err.status = 404;
    err.title = "Validation Error";
    return next(err);
  }

  const membership = await Membership.findAll({
    where: {
      [Op.and]: [{ userId: req.user.id }, { groupId: event.groupId }],
    },
  });
  if (!membership) {
    const err = new Error(
      "Must be a member of the group to request attendance"
    );
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }

  let attendanceCheck;
  const attendance = await Attendance.findOne({
    where: {
      [Op.and]: [{ userId: req.user.id }, { eventId: req.params.eventId }],
    },
  });
  if (!attendance) {
    const response = await Attendance.create({
      eventId: req.params.eventId,
      userId: req.user.id,
      status: "pending",
    });
    const responseObj = {
      userId: response.userId,
      status: response.status,
    };
    return res.json(responseObj);
  }
  attendanceCheck = attendance.status;

  if (attendanceCheck === "pending") {
    const err = new Error("Attendance has already been requested");
    err.status = 400;
    return next(err);
  } else if (attendanceCheck === "attending") {
    const err = new Error("User is already an attendee of the event");
    err.status = 400;
    return next(err);
  } else if (attendanceCheck === "waitlist") {
    const err = new Error("User is already on the waitlist for the event");
    err.status = 400;
    return next(err);
  }

  if (attendanceCheck) {
    const response = await Attendance.create({
      eventId: req.params.eventId,
      userId: req.user.id,
      status: "pending",
    });
    const responseObj = {
      userId: response.userId,
      status: response.status,
    };
    return res.json(responseObj);
  }
});

// ! Change the status oan attendance for an event specified by Id

router.put("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const { userId, status } = req.body;
  if (status === "pending") {
    const err = new Error("Cannot change an attendance status to pending");
    err.status = 400;
    err.title = "Bad Request";
    return next(err);
  }

  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }

  const membership = await Membership.findOne({
    include: {
      model: Group,
    },
    where: {
      [Op.and]: [{ userId: req.user.id }, { groupId: event.groupId }],
    },
  });

  const attendance = await Attendance.findOne({
    where: {
      [Op.and]: [{ userId: userId }, { eventId: req.params.eventId }],
    },
  });
  if (!attendance) {
    const err = new Error(
      "Attendance between the user and the event does not exist"
    );
    err.status = 404;
    err.title = "Not found";
    return next(err);
  }

  if (!membership || membership.status !== "co-host") {
    const err = new Error(
      "Must be Organizer or Co-host to change attendance status"
    );
    err.status = 403;
    err.title = "Unauthorized";
    return next(err);
  } else {
    attendance.set({
      status: "attending",
    });
    attendance.save();
    res.json(attendance);
  }
});

// ! Delete attendance to an event specified by id

router.delete("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const { userId } = req.body;
  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }

  const user = await User.findByPk(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    err.title = "Validation Error";
    return next(err);
  }

  const attendance = await Attendance.findOne({
    where: {
      [Op.and]: [{ userId: userId }, { eventId: req.params.eventId }],
    },
  });
  if (!attendance) {
    const err = new Error(
      "Attendance between the user and the event does not exist"
    );
    err.status = 404;
    err.title = "Not found";
    return next(err);
  }

  const currUserAttendance = await Attendance.findOne({
    where: {
      [Op.and]: [{ userId: userId }, { eventId: req.params.eventId }],
    },
  });

  const membership = await Membership.findOne({
    where: {
      [Op.and]: [{ userId: req.user.id }, { groupId: event.groupId }],
    },
  });

  if (userId === req.user.id) {
    currUserAttendance.destroy();
    return res.json({
      message: "Successfully deleted membership from group",
    });
  } else if (!membership || membership.status !== "co-host") {
    const err = new Error(
      "Must be Organizer, Co-host, or User for the request to change attendance status"
    );
    err.status = 403;
    err.title = "Unauthorized";
    return next(err);
  } else {
    currUserAttendance.destroy();
    return res.json({
      message: "Successfully deleted membership from group",
    });
  }
});

// ! Delete an event by Id

router.delete("/:eventId", requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId);
  if (!event) {
    const err = new Error("Event not found...");
    err.status = 404;
    err.title = "Event does not exist.";
    return next(err);
  }

  const membership = await Membership.findAll();
  const currUser = req.user.id;
  let confirm = false;

  membership.forEach((member) => {
    const memberId = member.userId;
    const memberStatus = member.status;
    const groupId = member.groupId;
    if (
      currUser === memberId &&
      memberStatus === "co-host" &&
      groupId === event.groupId
    ) {
      confirm = true;
    }
  });

  if (confirm) {
    event.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  } else {
    const err = new Error("User must be Organizer or Co-Host to access.");
    err.status = 401;
    err.title = "Unauthorized";
    return next(err);
  }
});

module.exports = router;
