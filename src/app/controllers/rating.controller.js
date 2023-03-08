const mongoose = require("mongoose")
const Account = require("../models/account.model")
const Destination = require("../models/destination.model")
const Village = require("../models/village.model")
const Rating = require("../models/rating.model")
const jwt = require("jsonwebtoken")


exports.create = function(req, res, next){
    var rate = Number(req.body.rate)
    var destinationId = req.body.destinationId
    var content = req.body.content
    var token = req.header("Authorization")                                             
    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        Account.findById(decode.id)
            .then(function(account){
                account = account.toObject()
                if(account.role == "tv"){
                    Rating.create({rate: rate, destinationId: destinationId, content: content, creator: account.username})
                        .then(function(){
                            //res.redirect("back")
                            res.json({msg: "Successfully"})
                        })
                        .catch(next)
                }
                else{
                    res.redirect("back")
                }
            })
            .catch(next)
    }
}
