const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {
    async index(req,res){
        const results = await Chef.showAll()
        const chefs = results.rows

        return res.render("admin/chefs/listing", {chefs})
        
    },
    create(req,res){

        return res.render("admin/chefs/create")
    },
    async post(req,res){
        const keys = Object.keys(req.body)
    
        for(key of keys){
            if(req.body[key] == "" && key!=="file_id"){
                return res.send(`Preencha o campo (${key}) para continuar!`)
            }
        }

        let results = await File.create({...req.file})
        const fileId = results.rows[0].id

        await Chef.create(req.body, fileId)
        
        return res.redirect("/admin/chefs")
       
    },
    async show(req, res){
        const chefIndex = req.params.index;

        let results = await Chef.find(chefIndex)
        const chef = results.rows[0]
        const chefFileId = results.rows[0].file_id

        results = await File.find(chefFileId)
        let chefFilePath = results.rows[0].path

        results = await Chef.recipeFind(chef.id)
        const recipes = results.rows

        
        return res.render("admin/chefs/chef", {chef, recipes, file_path: chefFilePath});
       
    },
    async edit(req,res){
        const chefIndex = req.params.index;

        const results = await Chef.find(chefIndex)
        const chef = results.rows[0]
        
        return res.render("admin/chefs/edit", {chef});
        
    },
    async put(req,res){
        const keys = Object.keys(req.body)
    
        for(key of keys){
            if(req.body[key] == "" && key!=="file_id" && key!=="id"){
                return res.send(`Preencha o campo (${key}) para continuar!`)
            }
        }
        
        const file  = {
            ...req.file,
            file_id: req.body.file_id
        }

        await File.update({...file})

        await Chef.update(req.body)
        
        return res.redirect(`/admin/chefs/${req.body.id}`)
    
    },

    async delete(req,res){
        if(req.body.total_recipes != 0){
            return res.send("Chefs que possuem receitas cadastradas não podem ser deletados!")
        }
        
        await Chef.delete(req.body.id)
    
        return res.redirect("/admin/chefs")
        
    },
    async list(req,res){
        const results = await Chef.showAll()
        const chefs = results.rows
        
        return res.render("site/chefs", { chefs })
        
    }
}
