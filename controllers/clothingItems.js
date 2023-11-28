const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error")

const createItem = (req, res, next) => {
  const { name, weather, imageUrl, likes } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, likes, owner })
    .then((item) => {
      res.send( item );
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad Request"));
      }
        next(err)

    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (userId !== item.owner.toString()) {
        return next(new ForbiddenError("Forbidden"));
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted"}));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data entry"))
      }
      if (err.name === "DocumentNotFoundError") {
       next(new NotFoundError("Info not found"));
      }
      next(err);
    });
};

const likeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.send( clothingItem );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
         next(new NotFoundError("Document not found"));
      }
      if (err.name === "CastError") {
         next(new BadRequestError("Invalid ID"));
      }
      next(err);
    });
};

const unlikeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((clothingItem) => {
      res.send( clothingItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
         next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
         next(new NotFoundError("Document not found"));
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
};
