
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require("../sequelize");
const Users = db.utilisateur;


exports.login = async function(req,res){
    let email = req.body.email;
    let password = req.body.password;
    Users.findOne({
        where: {
            email
        }
    }).then(data => {
        if(data == null){
            res.send({
                "code":206,
                "error":"Email does not exist"
            });
        }
        let user = data.dataValues
        console.log(user)
        const comparison = bcrypt.compare(password, user.password)
        if(comparison){

            let sess = req.session
            sess.user = user
            res.send({
                code: 200,
                success: "login successful",
                user: user
            })
        }else{
            res.send({
                "code":204,
                "error":"Email and password does not match"
            })
        }


    })
    console.log('HEEEEE', email)
/*
    db.query('SELECT * FROM user WHERE email = ? OR pseudo = ?',[username, username], async function (error, results, fields) {
        if (error) {
            res.send({
                "code":400,
                "failed":"error occurred",
                "error" : error
            })
        }else{
            if(results.length >0){
                const comparison = await bcrypt.compare(password, results[0].password)
                if(comparison){
                    let user = {
                        id: results[0].id,
                        pseudo: results[0].pseudo,
                        email: results[0].email,
                    }
                    let sess = req.session
                    sess.user = user
                    res.send({
                        code: 200,
                        success: "login successful",
                        user: user

                    })
                }else{
                    res.send({
                        "code":204,
                        "error":"Email and password does not match"
                    })
                }
            } else{
                res.send({
                    "code":206,
                    "error":"Email does not exist"
                });
            }
        }
    });
*/

}

exports.signup = async function (req, res){

    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.cpassword;

    let noInputsEmpty = email == "" ? "email" : ""  || password == "" ? "password" : "" || cpassword == "" ? "cpassword" : ""
    if(password == cpassword && noInputsEmpty == ""){
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        let user = {
            email: email,
            password : hash
        }
        const createUser = await Users.create(user).then(e => {
            res.send({
                code: 200,
                success: "signup successful",
                user: user,
                callback : "userSuccess"
            })
        }).catch(error => {
            res.send({
                "code":400,
                "failed":"error occurred",
                "error" : error,
                "callback" : "displayError",
                "errorMsg" : "Votre compte n'a pas pu etre créé, veuillez réessayer plus tard."
            })
        })


    }else{
        if(noInputsEmpty != ""){
            res.send({
                "code":206,
                "error":"Some inputs are empty",
                callback: "inputEmpty",
                errorMsg: noInputsEmpty
            });
        }else{
            res.send({
                "code":206,
                "error":"Passwords doesn't match",
                callback: "passwordMatch",
                errorMsg: null
            });
        }

    }


}

exports.verifyAuth = async function(req, res){
    if(req.session.user){
        return true
    }else{
        res.redirect('/login')
    }
}

exports.disconnect = async function(req, res){
    delete req.session.user;
    res.redirect('/login')
}
