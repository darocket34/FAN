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
const router = express.Router();

const validateEvent = [
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity").isNumeric().withMessage("Capacity must be an integer"),
  check("price").notEmpty().isDecimal().withMessage("Price is invalid"),
  check("description").notEmpty().withMessage("Description is required"),
  check("startDate").notEmpty().withMessage("Start date must be in the future"),
  check("endDate").notEmpty().withMessage("End date is less than start date"),
  handleValidationErrors,
];

// ! Get all events

router.get("/", async (req, res) => {
  const events = await Event.findAll({
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
        where: {
          status: "attending",
        },
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  let eventsRes = [];
  events.forEach((event) => {
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
      numAttending: event.Attendances.length,
      previewImage: event.previewImage,
      Group: event.Group,
      Venue: event.Venue,
    });
    delete event.EventImages;
  });

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
