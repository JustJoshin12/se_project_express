const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

const { authorize } = require("../middleware/auth");
const { validateCardBody, validateId } = require("../middleware/validation");
// CRUD

// Create
router.post("/", authorize, validateCardBody, createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId/likes", authorize, validateId, likeClothingItem);

// Delete
router.delete("/:itemId", authorize, validateId, deleteItem);
router.delete("/:itemId/likes", authorize, validateId, unlikeClothingItem);

module.exports = router;
