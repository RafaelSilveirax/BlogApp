module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){//req.user.eAdmin == 1 [Deixa entrar so o admim]
            return next();
        }

        req.flash("error_msg", "Voce precisa ser um Admin!")
        res.redirect("/")
    }

}