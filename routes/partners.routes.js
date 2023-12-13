const router = require("express").Router();
const mongoose = require("mongoose");
const Partner = require("../models/Partner.model");

// GET /api/partners - Retrieves all partners
router.get("/partners", (req, res, next) => {
  Partner.find()
    .then((allPartners) => res.json(allPartners))
    .catch((err) => res.json(err));
});

// GET /api/partners/:partnerId - Retrieves a specific partner by id
router.get("/partners/:partnerId", (req, res, next) => {
  const { partnerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Partner.findById(partnerId)
    .then((partner) => res.status(200).json(partner))
    .catch((error) => res.json(error));
});

// PUT /api/partners/:partnerId - Updates a specific partner by id
router.put("/partners/:partnerId", (req, res, next) => {
  const { partnerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Partner.findByIdAndUpdate(partnerId, req.body, { new: true })
    .then((updatedPartner) => res.json(updatedPartner))
    .catch((error) => res.json(error));
});

// DELETE /api/partners/:partnerId - Deletes a specific partner by id
router.delete("/partners/:partnerId", (req, res, next) => {
  const { partnerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Partner.findByIdAndRemove(partnerId)
    .then(() =>
      res.json({
        message: `Partner with ${partnerId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

// POST /api/partners - Creates a new partner
router.post("/partners", (req, res, next) => {
  const { name, address } = req.body;

  Partner.create({ name, address })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;
