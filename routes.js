const express = require('express');
const path = require('path');
const fs = require('fs');
const mercadopago = require ('mercadopago');
require('./config/config');

mercadopago.configure({
    access_token: ACCESS_TOKEN,
    integrator_id: INTEGRATOR_ID,
});

const app = express();

app.get('/', function (req, res) {
    res.render('home', {view: 'home'});
});

app.get('/detail', function (req, res) {
    res.render('detail', Object.assign({view: 'item'}, req.query));
});

app.post('/checkout', function (req, res) {
    let preference = {
        items: [{
            title: req.body.title,
            unit_price: Number(req.body.price),
            quantity: 1, //Number(req.body.unit),
            picture_url: path.join(BASE_URL + req.body.img),
            id: '1234',
            description: 'Dispositivo móvil de Tienda e-commerce'
        }],
        external_reference: 'gpetraglia@quaresitsolutions.com',
        payer:{
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
                area_code: '11',
                number: 22223333
            },
            address: {
                zip_code: '1111',
                street_name: 'False',
                street_number: 123
            }
        },
        back_urls: {
            "success": BASE_URL + '/success',
            "failure": BASE_URL + '/failure',
            "pending": BASE_URL + '/pending'
        },
        auto_return: 'approved',
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "amex"
                }
            ],
            excluded_payment_types: [
                {
                    id: "atm"
                }
            ],
            installments: 6
        },
        notification_url: BASE_URL + '/notification'
    };


    mercadopago.preferences.create(preference)
		.then(function (response) {
			res.redirect(response.body.init_point);
		}).catch(function (error) {
			console.log(error);
        });

});


app.get('/success', function (req, res) {
    if(req.query.payment_id){
        let data = {
            view: '',
            message: 'Gracias por su compra, el pago se efectuo con exito.',
            payment_id: req.query.payment_id,
            external_reference: req.query.external_reference,
            merchant_order_id: req.query.merchant_order_id,
            preference_id: req.query.preference_id,
            payment_type: req.query.payment_type
        }
        res.render('message', data);
    }
    else {
        res.redirect('/');
    }
});

app.get('/failure', function (req, res) {
    if(req.query.payment_id){
        let data = {
            view: '',
            message: 'Ocurrio un error al efectuar el pago, por favor reintentar.',
            payment_id: req.query.payment_id,
            external_reference: req.query.external_reference,
            merchant_order_id: req.query.merchant_order_id,
            preference_id: req.query.preference_id,
            payment_type: req.query.payment_type
        }
        res.render('message', data);
    }
    else {
        res.redirect('/');
    }
});

app.get('/pending', function (req, res) {
    if(req.query.payment_id){
        let data = {
            view: '',
            message: 'Gracias por su compra, el pago se encuentra pendiente.',
            payment_id: req.query.payment_id,
            external_reference: req.query.external_reference,
            merchant_order_id: req.query.merchant_order_id,
            preference_id: req.query.preference_id,
            payment_type: req.query.payment_type
        }
        res.render('message', data);
    }
    else {
        res.redirect('/');
    }
});

app.post('/notification', function (req, res) {
    fs.writeFileSync('./log.json', JSON.stringify(req));
    res.status(200).json({});
});

app.get('/log', function (req, res) {
    let log = require('./log.json');
    res.json(log);
});


module.exports = app