const express = require('express')
const routes = express.Router()
const multer = require("./app/middlewares/multer")

const recipes = require("./app/controllers/recipes")
const admin = require("./app/controllers/admin")
const chefs = require("./app/controllers/chefs")

routes.get("/", recipes.index)

routes.get("/recipes/:index", recipes.show)
routes.get("/about", recipes.about)
routes.get("/recipes", recipes.list)
routes.get("/chefs", chefs.list)


routes.get("/admin/recipes", admin.index)
routes.get("/admin/recipes/create", admin.create)
routes.get("/admin/recipes/:index", admin.show)
routes.get("/admin/recipes/:index/edit", admin.edit)

routes.post("/admin/recipes", multer.array("file", 5), admin.post)
routes.put("/admin/recipes", multer.array("file", 5), admin.put)
routes.delete("/admin/recipes", admin.delete)

routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:index", chefs.show)
routes.get("/admin/chefs/:index/edit", chefs.edit)

routes.post("/admin/chefs", multer.single("path_file", 5), chefs.post)
routes.put("/admin/chefs", multer.single("path_file", 5), chefs.put)
routes.delete("/admin/chefs", chefs.delete)

module.exports = routes