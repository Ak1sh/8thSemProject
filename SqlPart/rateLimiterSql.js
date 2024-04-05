const userModel = require('../models/user-limit-sql')
const User = userModel.UserSql
const axios = require('axios')
require('dotenv').config()


exports.welcome = async (req, res) => {
    console.log(req.backendServerURL)
    res.json({ msg: "welcome controller" })
}

exports.lightEndPoint = async (req, res) => {
    console.log(req.backendServerURL)
    var userIP = req.connection.remoteAddress
    if (userIP == "::1") {
        userIP = "127.0.0.1"
    }
    console.log(userIP)
    res.json({ msg: 'light end point', backend_sever: req.backendServerURL })
    //this is where u can change the tokenSize
    userModel.setUserSQl(new userModel.UserSQl(userIP, Date.now() / 1000, process.env.TOKEN_SIZE)).catch(err => { console.log("The rate limit has been exceeded", err) })
    const msg = await axios.get(`${req.backendServerURL}/requestHandler`)
    console.log(msg.data)
}
