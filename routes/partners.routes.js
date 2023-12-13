// routes/project.routes.js

const router = require("express").Router();

const mongoose = require("mongoose");

const Partner = require("../models/Partner.model");

// GET /api/projects -  Retrieves all of the projects
router.get("/partners", (req, res, next) => {
  Partner.find()
    .then((allPartners) => res.json(allPartners))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/partners/:partnerId", (req, res, next) => {
  const { partnerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has a `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Partner.findById(partnerId)
    .then((partner) => res.status(200).json(partner))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/partners/:partnerId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Partner.findByIdAndUpdate(partnerId, req.body, { new: true })
    .then((updatedPartner) => res.json(updatedPartner))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/partners/:partnerId", (req, res, next) => {
  const { partnerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(partnerId)
    .then(() =>
      res.json({
        message: `Partner with ${partnerId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

//  POST /api/partners  -  Creates a new partner
router.post("/partners", (req, res, next) => {
  const { name, adress } = req.body;

  Partner.create({ name, adress: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;