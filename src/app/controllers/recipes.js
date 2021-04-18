const Recipe = require("../models/Recipe")

module.exports = {
    async index(req,res){
        let results = await Recipe.showAll(req.query)
        let recipes = results.rows

        results = await Recipe.selectChef()
        chefs = results.rows
    
        return res.render("site/foodfy", {recipes, chefs})
        
    },
    async show(req, res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]

        
        results = await Recipe.findChef(recipe.chef_id)

        const chef = results.rows[0]
    
        return res.render("site/recipe", {recipe, chef})
        
    },
    about(req,res){
        return res.render("site/about")

    },
    async list(req,res){
        let results = await Recipe.showAll(req.query)
        let recipes = results.rows

        results = await Recipe.selectChef()
        chefs = results.rows
        
        return res.render("site/recipes", {recipes, filter: req.query.filter, chefs})
        
    }
}
