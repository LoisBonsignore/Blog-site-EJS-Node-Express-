const express = require("express");
const blogController = require("../controllers/blogController")

const router = express.Router();


// blog routes 

// Récupération de la page d'accueils et des blogs
router.get("/", blogController.blog_index);

// Poster un blog à partir du form
router.post("/", blogController.blog_create_post);

// récupération du form
router.get("/create", blogController.blog_create_get);

// blog par id
router.get("/:id", blogController.blog_details)

// supprimer un blog
router.delete("/:id", blogController.blog_delete)


module.exports = router;