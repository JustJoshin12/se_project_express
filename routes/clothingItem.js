const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId/likes", likeClothingItem);

// Delete
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", unlikeClothingItem);

module.exports = router;
