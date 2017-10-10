const mongoose = require('mongoose'),
    User = mongoose.model('User'),
    session = require('express-session'),
    current_user = require('../controllers/users.js')

module.exports = {
    log_reg: (req, res) => {
        console.log(req.session._id)
        if(req.session._id){
            res.redirect('/main')
        }
        else{
            let err = undefined
            if('err' in req.session){
                err = req.session.err
                console.log(err)
            }
            delete req.session.err
            res.render('index', {errors: err})
        }
    },
    create: (req, res) => {
        let user = new User(req.body)
        console.log(user)
        console.log(req.body.confirm_password)
        if(user.password != req.body.confirm_password) {
            let err = {
                errors: {confirm: { message: "Passwords do not match!"}},
                message: "nothing"
            }
            req.session.err = err
            console.log(req.session.err)
            res.redirect('/')
        }
        else{
            user.save((err) => {
                if(err){
                    console.log(err)
                    console.log("something went wrong")
                    req.session.err = err
                    console.log(req.session.err)
                    res.redirect('/')
                }
                else {
                    req.session._id = user._id
                    res.redirect('/main')
                }
            })
        }
    },
    show: (req, res) => {
        User.find({}, (err, users) => {
            res.json(users)
        })
    },
    login: (req, res) => {
        console.log(req.body.email)
        if(req.body.email == "" || req.body.password == "") {
            console.log('blank error')
            let err = {
                errors: {login: { message: "Please do not leave login entries blank!"}},
                message: "nothing"
            }
            req.session.err = err
            res.redirect('/')
        }
        else{
            User.findOne({email: req.body.email}, (err, user) => {
                if(user == null){
                    console.log('user not in database')
                    err = {
                        errors: {login: { message: "User not in database!"}},
                        message: "nothing"
                    }
                    req.session.err = err
                    res.redirect('/')
                }
                else{
                    user.comparePassword(req.body.password, (err, isMatch) => {
                        if(err) {
                            req.session.err = err
                            res.redirect('/')
                        }
                        else{
                            console.log(user)
                            req.session._id = user._id
                            console.log(req.session._id)
                            res.redirect('/main')
                        }    
                })
            }

            })
        }
    },
        // User.findOne({email: req.body.email}, (err, user) => {
        //     if(err) {
        //         console.log(err)
        //         res.redirect('/')
        //     }
        //     else{
        //         user.comparePassword(req.body.password, (err, isMatch) => {
        //             if(err) res.render('index', {errors: user.errors})
        //             console.log(user)
        //             req.session._id = user._id
        //             console.log(req.session._id)
        //             res.redirect('/main')
        //         })
        //     }
        // })
    main: (req, res) => {
        if(!req.session._id) res.redirect('/')
        else{
            console.log(req.session._id)
            User.findById({_id:req.session._id}, (err, user) => {
                console.log(err)
                console.log(user)
                if(err) {
                    req.session.errors = user.errors
                    res.redirect('/')
                }    
                res.render('main', {user: user})
            })
        }
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    }
}