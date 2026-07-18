const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/categoryController");


router.get(
    "/category/:id",
    categoryController.buildCategoryDetail
);


module.exports = router;