
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
    }).then(async (data) => {
        if(data == null){
            res.send({
                "code":206,
                "error":"Email does not exist",
                callback:"authError",
                errorMsg: "L'email saisi n'existe pas"
            });
        }
        let user = data.dataValues
        console.log(user)
        const comparison = await bcrypt.compare(password, user.password)
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
                callback:"authError",
                errorMsg: "L'email et le mot de passe saisis ne correspondent pas"
            })
        }


    })

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
                "callback" : "authError",
                "errorMsg" : "Votre compte n'a pas pu etre créé, veuillez réessayer plus tard."
            })
        })


    }else{
        if(noInputsEmpty != ""){
            res.send({
                "code":206,
                "error":"Some inputs are empty",
                callback: "authError",
                errorMsg: "Merci de remplir les champs nécessaires"
            });
        }else{
            res.send({
                "code":206,
                "error":"Passwords doesn't match",
                callback: "authError",
                errorMsg: "Les mots de passe saisis ne correspondent pas"
            });
        }

    }


}

exports.verifyAuth = async function(req, res){
    res.removeHeader('Transfer-Encoding');
    res.removeHeader('X-Powered-By');
    if(req.session.user){
        return true
    }else{
        res.redirect('/login')
    }
}

exports.disconnect = async function(req, res){
    delete req.session.user;
    res.send({
        code: 200,
        success: req.session.user == null,
    })
}

exports.modifyAccount = async function(req, res){
    let id = req.body.idUser
    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    let deleteUser = req.body.deleteUser
    let response = null
    if(email){
        await Users.update({ email }, {
            where: {
                id
            }
        }).then(data => {
            console.log(data)
            response = {
                code: 200,
                callback:'userModal',
                title: "modification email",
                desc: "Votre email a bien été modifié. Votre nouvel email de contact et de connexion est donc : \n<b>"+email+"</b>",
                data
            }
        }).catch(err => {
            console.log(err)
            response = {
                code: 400,
                callback:'userModal',
                title: "modification email",
                desc: "Il semblerait qu'il y ait eu une erreur dans la modification de votre email. Veuillez réessayer plus tard."
            }
        });
    }else if (password){
        let noInputsEmpty =  password == "" ? "password" : "" || cpassword == "" ? "cpassword" : ""
        if(password == cpassword && noInputsEmpty == ""){
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);

            await Users.update({ password: hash }, {
                where: {
                    id
                }
            }).then(data => {
                console.log(data)
                response = {
                    code: 200,
                    callback:'userModal',
                    title: "modification mot de passe",
                    desc: "Votre mot de passe a bien été modifié."

                }
            }).catch(err => {
                console.log(err)
                response = {
                    code: 400,
                    callback:'userModal',
                    title: "modification email",
                    desc: "Il semblerait qu'il y ait eu une erreur dans la modification de votre mot de passe. Veuillez réessayer plus tard."

                }
            });

        }else{
            console.log({
                code: 400,
                error: "Passwords don't match"
            })
            response = {
                code: 401,
                callback:'userModal',
                title: "Les mots de passe ne concordent pas ou sont vides",
                desc: "Il semblerait qu'il y ait eu une erreur dans la modification de votre mot de passe. Veuillez réessayer plus tard."

            }
        }
    }else if(deleteUser){
        await Users.destroy({
            where: {
                id
            }
        }).then(data => {
            console.log(data)
            delete req.session.user;
            response = {
                code: 200,
                callback:'userModal',
                title: "Suppression de compte",
                desc: "Votre compte a bien été supprimé."
            }
        }).catch(err => {
            console.log(err)
            response = {
                code: 400,
                callback:'userModal',
                title: "Suppression de compte",
                desc: "Il semblerait qu'il y ait eu une erreur dans la suppression de votre compte. Veuillez réessayer plus tard."
            }
        });;
    }
    res.send(response)
}
