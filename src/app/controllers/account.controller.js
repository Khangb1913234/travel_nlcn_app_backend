const mongoose = require("mongoose")
const Account = require("../models/account.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { parse, compareAsc} = require('date-fns')

exports.register = function(req, res, next){ 
    const account = new Account(
        {
            email: req.body.email,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            role: "tv"
        }
    )
    const name = req.body.username
    Account.findOne({username: name})
        .then(function(acc){
            if(acc){
                res.json({msg: "Fail"})
            }
            else{
                account.save()
                    .then(function(){
                        res.json({msg: "Success"})
                    })
                    .catch(next)  
            }
                                   
        })
        .catch(function(err){
            console.log(err)
        })
    
}
exports.login = function(req, res, next){
    Account.findOne({username: req.body.username})
        .then(function(account){
            if(account){
                const check = bcrypt.compareSync(req.body.password, account.password)
                if(check){
                    var token = jwt.sign({id: account._id}, "krystal", {expiresIn: 3600})
                    res.json({account: account, token: token})
                }
                else
                    res.json({msg: "Fail Password"})
            }
            else    
                res.json({msg: "Fail Username"})
        })
        .catch(function(err){
            console.log(err)
        })
}

exports.update = function(req, res, next){
    var token = req.header("Authorization")                                             
    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        var id = req.params.id
        Account.findById(decode.id)
            .then(function(account){
                if(account.role == "qtv"){
                    account = account.toObject()
                    if(req.body.role == "qtv" || req.body.role == "ctv1" || req.body.role == "ctv2" || req.body.role == "tv"){
                        Account.findOneAndUpdate({_id: id, role: {$ne: "qtv"}}, req.body, {new: true})
                            .then(function(){
                                res.json({msg: "Successfully"})
                            })
                            .catch(function(err){
                                console.log(err)
                            })
                    }
                    else{
                        res.json({msg: "Fail1"})
                    }
                }
                else{
                    res.json({msg: "Fail2"})
                }
                
            })
            .catch(next)
    }
}

exports.delete = function(req, res, next){
    var token = req.header("Authorization")                                             
    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        var id = req.params.id
        Account.findById(decode.id)
            .then(function(account){
                if(account.role == "qtv"){
                    account = account.toObject()
                    Account.findOneAndDelete({_id: id, role: {$ne: "qtv"}})
                        .then(function(){
                            res.json({msg: "Successfully"})
                        })
                        .catch(next)
                }
                else{
                    res.json({msg: "Fail"})
                }
                
            })
            .catch(next)
    }
}

exports.action = function(req, res, next){
    if(req.body.action == "delete"){
        var token = req.header("Authorization")                                             
        if(token){
            token = token.substr(7)
            var decode = jwt.verify(token, "krystal")
            Account.findById(decode.id)
                .then(function(account){
                    account = account.toObject()
                    if(account.role == "qtv"){
                        Account.deleteMany({_id: { $in: req.body.accounts }, role: {$ne: "qtv"}})             //Duyệt qua những id có trong destinations
                            .then(function(){
                                //res.redirect(`/me/stored/types`)
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
    else{
        //res.redirect("/me/stored/types")
        res.json({msg: "Fail"})
    }
}

exports.detail = function(req, res, next){
    var token = req.header("Authorization")                                             
        if(token){
            token = token.substr(7)
            var decode = jwt.verify(token, "krystal")
            Account.findById(decode.id)
                .then(function(account){
                    account = account.toObject()
                    res.json({account})
                })
                .catch(next)
        }
        else{
            res.json({msg: "Fail"})
        }
}

exports.statisticNewMember = function(req, res, next){
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date7DaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
    date7DaysAgo.setHours(0, 0, 0, 0)
    var token = req.header("Authorization")

    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        Account.findById(decode.id)
            .then(function(account){
                if(account.role == "qtv"){
                    Account.aggregate([
                        {
                          $match: {
                            createdAt: {
                              $gte: date7DaysAgo,
                              $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                            },
                            role: "tv"
                          },
                        },
                        {
                          $group: {
                            _id: {
                              $dateToString: {
                                format: '%d-%m-%Y',
                                date: '$createdAt',
                              },
                            },
                            total: { $sum: 1 },
                          },
                        },
                        {
                            $sort: {
                              _id: 1
                            }
                        }
                    ])
                    .then(function(result){
                        for(var i = 0; i < 7; i++){
                            date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
                            const day = date.getDate().toString().padStart(2, '0')
                            const month = (date.getMonth() + 1).toString().padStart(2, '0')
                            const year = date.getFullYear();
                            const formattedDate = `${day}-${month}-${year}`
                            const exists = result.some(item => item._id === formattedDate);
                            if(!exists){
                                var obj = {
                                    _id: formattedDate,
                                    total: 0
                                }
                                result.unshift(obj)
                            }
                            
                        }
                        console.log(result)
                        res.json({result})
                    })
                    .catch(next)
                    
                        
                }
                else{
                    res.json({msg: "Fail"})
                }
            })
            .catch(next)
    }
    else{
        res.json({msg: "Fail"})
    }
    
}
