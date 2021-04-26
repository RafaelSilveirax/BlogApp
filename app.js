//Caregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParse = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path") //Diretorio para manipular pastas
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const passport = require('passport')
require("./config/auth")(passport)
const db = require("./config/db")

//Configuracao
    //sessao
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized:true
        }))
        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    //middleware
        app.use(function(req, res, next){
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null; // aula 60 
            next()
        })

    //Bodyparser
        app.use(bodyParse.urlencoded({extended:true}))
        app.use(bodyParse.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise;// para evitar alguns erros
        mongoose.connect("mongodb://localhost/blogapp").then(function(){
            console.log("Conectado ao Banco de dados ")
        }).catch(function(err){
            console.log("Erro ao se conectar ao banco de dados" + err)
        })

    //Public
        app.use(express.static(path.join(__dirname,"public")))

//Rotas
    app.get('/', function(req,res){
        Postagem.find().lean().populate("categoria").sort({data:"desc"}).then(function(postagens){
            res.render("index",{postagens: postagens})
        }).catch(function(err){
            req.flash("error_msg","Houve um error interno")
            res.redirect("/404")
        })
        
    })

    app.get("/postagem/:slug",function(req,res){
        Postagem.findOne({slug: req.params.slug}).lean().then(function(postagem){
            if(postagem){
                res.render("postagem/index",{postagem: postagem})
            }else{
                req.flash("error_msg","Esta postagem não existe")
                res.redirect("/")
            }
        }).catch(function(err){
            req.flash("error_msg", "houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", function(req,res){
        Categoria.find().lean().then(function(categorias){
            res.render("categorias/index",{categorias: categorias})
        }).catch(function(err){
            req.flash("erro_msg", "Houve um erro interno ao listar as categorias")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", function(req,res){
        Categoria.findOne({slug: req.params.slug}).lean().then(function(categoria){
            if(categoria){

                Postagem.find({categoria: categoria._id}).lean().then(function(postagens){

                    res.render("categorias/postagens",{postagens: postagens, categoria: categoria})

                }).catch(function(err){
                    req.flash("erro_msg", "Houve um erro ao listar as posts!")
                    res.redirect("/")
                })

            }else{
                req.flash("error_msg","Esta categoria não existe")
                res.redirect("/")
            }
        }).catch(function(err){
            req.flash("erro_msg", "Houve um erro interno ao listar as categorias")
            res.redirect("/")
        })
    })

    app.get("/404", function(req,res){
        res.send('Erro 404!')
    })

    //Arquivo rotas admim
    app.use('/admin',admin)
    app.use("/usuarios", usuarios)

//outros
const PORT = process.env.PORT || 8081
app.listen(PORT,function(){
    console.log("Servidor rodando")
})
    
