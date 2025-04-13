const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Jwt_secret } = require("../keys");
const requireLogin = require("../middlewares/requireLogin");


router.post("/api/signup", (req, res) => {
    const { name, userName, email, password } = req.body;



    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then((saveUser) => {
        if (saveUser) {
            return res.status(422).json({ error: "User already exits with that email" })
        }

        if (!name || !email || !userName || !password) {
            return res.status(422).json({ error: "Please add all the fields" })
        }


        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new USER({
                name,
                email,
                userName,
                password: hashedPassword,
            })


            user.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })

        })

    })


})


router.post("/api/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "please add email and password" });
    }

    USER.findOne({ email: email }).then((saveUser) => {
        if (!saveUser) {
            return res.status(422).json({ error: "Invalid email" })
        }
        bcrypt.compare(password, saveUser.password).then((match) => {
            if (match) {
                // return res.status(200).json({message:"Signed in successfully"})
                const token = jwt.sign({ _id: saveUser.id }, Jwt_secret)
                const { _id, name, email, userName } = saveUser
                res.json({ "token": token, user: { _id, name, email, userName } });
                console.log()
            }
            else {
                return res.status(422).json({ error: "Invalid Password" })
            }
        }).catch(err => console.log(err))

    })
})

module.exports = router