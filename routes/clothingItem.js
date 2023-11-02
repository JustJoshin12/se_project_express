const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

const { authorize } = require("../middleware/auth");
// CRUD

// Create
router.post("/", authorize, createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId/likes", authorize, likeClothingItem);

// Delete
router.delete("/:itemId", authorize, deleteItem);
router.delete("/:itemId/likes", authorize, unlikeClothingItem);

module.exports = router;
