const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
    async index(req,res){
        let results = await Recipe.showAll(req.query)
        let recipes = results.rows

        results = await Recipe.selectChef()
        chefs = results.rows

        return res.render("admin/recipes/listing", {recipes, chefs})
        
    },
    async create(req,res){
        const results = await Recipe.selectChef()
        const chefs = results.rows

        return res.render("admin/recipes/create", {chefs})
    
    },
    async post(req,res){
        const keys = Object.keys(req.body)

    
        const filteredKeys = keys.filter(function(key){
            return (key !=='information' && key !=='removed_files')
        })
    
        for(key of filteredKeys){
            if(req.body[key] == ""){
                return res.send(`Preencha o campo (${key}) para continuar!`)
            }
        }

        if(req.files.length == 0) return res.send("Envie ao menos 1 foto!")

        let results = await Recipe.create(req.body)

        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(async file => {
            results = await File.create({...file})

            const fileId = results.rows[0].id

            await File.recipe(recipeId, fileId)
        })
            
        await Promise.all(filesPromise)
        
        
        return res.redirect("/admin/recipes")
    
    },
    async show(req,res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]

        
        results = await Recipe.findChef(recipe.chef_id)

        const chef = results.rows[0]
        
        return res.render("admin/recipes/recipe", {recipe, chef});
        
    },
    async edit(req,res){
        const recipeIndex = req.params.index;

        let results = await Recipe.find(recipeIndex)
        const recipe = results.rows[0]
        results = await Recipe.selectChef()
        const chefs = results.rows
        
        return res.render("admin/recipes/edit", {recipe, chefs});

    },
    async put(req,res){
        const keys = Object.keys(req.body)
    
        const filteredKeys = keys.filter(function(key){
            return (key !=='information' && key !== "removed_files" && key !== "file_id")
        })
    
        for(key of filteredKeys){
            if(req.body[key] == ""){
                return res.send(`Preencha o campo (${key}) para continuar!`)
            }
        }

        if(req.files)

        if(req.files.length != 0){
            const newFilesPromise = req.files.map(async file =>{
                const results = await File.create({...file})
                const fileId = results.rows[0].id

                await File.recipe(req.body.id, fileId)

            })
            await Promise.all(newFilesPromise)
        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id =>{
                File.delete(id)
                File.recipeDelete(id)
            })
            await Promise.all(removedFilesPromise)
        }


        return res.redirect(`/admin/recipes/${req.body.id}`)

    },
    async delete(req,res){
        const { id } = req.body
        const results = await Recipe.findFiles(id)
        const files = results.rows

        const deleteFiles = files.map(file => {
            File.recipeDelete(file.file_id).then(
                File.delete(file.file_id)
            )
        })

        await Promise.all(deleteFiles)

        await Recipe.delete(id)
        
        return res.redirect("/admin/recipes")
        
    }
}
