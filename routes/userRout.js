const express = require('express');
const router = express.Router();
const userSchema = require('../validator/usersValidationJoi');
const UserModel = require('../models/usersMongoSchema');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const _ = require('lodash');
const chalk = require ('chalk');


router.post("/create" ,createRequest);

async function createRequest(req, res) {
        const { error, value } = userSchema.newUser.validate(req.body);
        const user = value;
        if (error) {
            res.status(400).send(error);
            console.log(chalk.red(error));
        }
        else {
            try {
                const result = await UserModel.find({email:user.email});
                if (result.length > 0) {
                    res.status(400).send("User already exists")
                    console.log(chalk.red(res.status));
                }
                else {
                    try {
                     const savedUser = await saveUser(user);
                     res.status(201).send(savedUser);
                     console.log(chalk.green(saveUser));
                    }
                    catch (err) {
                        res.status(400).send(err);
                        console.log(chalk.red(err));
                    }
                    
                }
            } catch (err) {
                res.status(400).send(err);
                console.log(chalk.red(err));
            }
        
        }
    };
    
function saveUser(user){
    return new Promise(async (resolve, reject) => {
        try {
            user.password = await bcrypt.hash(user.password, saltRounds);
            const savedUser = await new UserModel(user).save();
            resolve(_.pick(savedUser,['email','_id','createdAt','name']));
       } catch (err) {
           reject (err);
       }
    })
};

    router.post("/auth" ,login);

    async function login(req,res){
        const { error, value } = userSchema.auth.validate(req.body);
        const user = value;
        if (error) {
            res.status(400).send(error);
            console.log(chalk.red(error));
        }
        else{
            try{
                const userModel = await UserModel.findOne({email:user.email});
                if (!userModel) { 
                    res.status(400).send("Username or password wrong");
                    return;
                }
                const isAuth = await userModel.checkPassword(user.password);
                res.status(200).send(isAuth);
                console.log(chalk.green(isAuth));
            } catch (err) {
                res.status(400).send(err);
                console.log(chalk.red(err));
            }
        }
    };

module.exports = router;