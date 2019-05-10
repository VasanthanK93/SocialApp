var userModel = require('../models/userModel.js')
var jwt = require("jsonwebtoken")

module.exports = {
    create: async (req, res) => {
        try {
            let finduser = await userModel.findOne({ loginID: req.body.loginID });
            if (!finduser) {
                let userData = new userModel(req.body)
                let createUser = await userModel.create(userData);
                return res.json({ status: "success", message: "User Created successfully!!!", data: createUser })
            }
            res.json({ status: "error", message: "User Already Available!!!", data: null })
        }
        catch (err) {
            res.send(err);
        }

    },
    authenticate: async (req, res) => {
        try {
            let finduser = await userModel.findOne({ loginID: req.body.loginID,password:req.body.password  })
            if (!finduser) {
                res.send({ Status: "error", message: "user is not available" })
            } else {
                if (req.body.password == finduser.password) {
                    const token = jwt.sign({ _id: finduser._id }, req.app.get('secretkey'),
                        { expiresIn: "1h" });
                    return res.json({ status: "Success", data: { user: finduser, token: token } })
                }
                res.json({ status: "error", message: "Invalid LoginID/Password", data: null })
            }

        } catch (err) {
            res.send(err)
        }

    }
}