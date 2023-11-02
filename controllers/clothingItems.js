const ClothingItem = require("../models/clothingItem");
const { invalidData, notFound, serverError, forbidden } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, likes, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: "Invalid data entry" });
      }
      return res.status(serverError).send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res.status(serverError).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (userId !== item.owner.toString()) {
        return res.status(forbidden).send({ message: "Access denied" });
      }
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid data entry" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Info not found" });
      }
      return res.status(serverError).send({ message: "Error from deleteItem" });
    });
};

const likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid ID" });
      }
      return res
        .status(serverError)
        .send({ message: "There has been a server error" });
    });
};

const unlikeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.send({ data: clothingItem });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(invalidData).send({ message: "Invalid Id" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Document not found" });
      }
      return res
        .status(serverError)
        .send({ message: "There has been a server error" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
};
