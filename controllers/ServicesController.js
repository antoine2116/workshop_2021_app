const db = require("../sequelize");
const Users = db.utilisateur;
const ServicesUser = db.conteneur_user;
const Conteneurs = db.conteneur;
const { QueryTypes } = require('../sequelize');
const querystring = require('querystring');

const axios = require('axios')

exports.createService = async function(formData) {
    let lastService = await ServicesUser.findOne({
        order: [ [ 'createdAt', 'DESC' ]],
    });

    let port = lastService ? lastService.port + 1 : 8080;
    console.log('port : ', port);
    axios
        .post('http://192.168.100.22:8080/job/install_server_web_v2/buildWithParameters', querystring.stringify({
            withCredentials: true,
            CONTAINER_NAME: formData.nomService,
            CONTAINER_IMAGE: formData.versionPhp == '8.0' ? 'php:8-apache-buster' : 'php:7-apache-buster',
            PUBLISHED_PORT: port,
            SITE_NAME: formData.nomDomaine
        }),{
            auth: {
                username: "jenkins",
                password: "110cfe7a5021066ed666c1e02b70313905"
        }})
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        });

     let conteneur = await Conteneurs.findOne( {where: {type: 'Serveur Web'}})
        .then(conteneur => {
            return conteneur;
        });

     let service = await ServicesUser.create({
        nom: formData.nomService,
        domaine: formData.nomDomaine,
        version: formData.versionPhp,
        userId: formData.userid,
        conteneurId: conteneur.id,
        port: port,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return service;
}

exports.getListeServices = async function(userid) {
    return await db.sequelize
        .query("SELECT conteneur_users.id, conteneur_users.updatedAt, conteneurs.type, conteneur_users.nom, conteneur_users.domaine, conteneur_users\n" +
            ".version \n" +
            "FROM conteneur_users\n" +
            "LEFT JOIN conteneurs ON conteneurs.id = conteneur_users.conteneurId\n" +
            "WHERE conteneur_users.userId = " + userid, {raw: true});
}

exports.getServiceById = async function(id) {
    return await ServicesUser.findByPk(id).then(conteneur => { return conteneur });
}

exports.deleteService = async function(id) {
    await ServicesUser.findOne({
        where: {
            id : id
        }
    })
        .then(service => {
            // Call api
            axios
                .post('http://192.168.100.22:8080/job/uninstall_server_web_v2/buildWithParameters', querystring.stringify({
                    withCredentials: true,
                    CONTAINER_NAME: service.nom,
                    PUBLISHED_PORT: service.port,
                    SITE_NAME: service.domaine
                }),{
                    auth: {
                        username: "jenkins",
                        password: "110cfe7a5021066ed666c1e02b70313905"
                    }})
                .then(res => {
                    console.log(`statusCode: ${res.status}`)
                    console.log(res)
                    service.destroy();
                })
                .catch(error => {
                    console.error(error)
                });

        });
}