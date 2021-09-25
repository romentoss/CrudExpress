'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Product = require('./models/product.js');
const product = require('./models/product.js');

const app = express();
const port = process.env.PORT || 3000;


//MiddleWare desde dev segunda vez
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/product', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) {
            return res.status(500).send({ message: `error al realizar la peticion:${err}` });
        }
        if (!products) {
            return res.status(404).send({ message: `No existen productos` });
        } else {
            return res.status(200).send({ products });
        }
    })

});

app.get('/api/product/:productId', (req, res) => {
    let productId = req.params.productId;

    Product.findById(productId, (err, product) => {
        if (err) {
            return res.status(500).send({ message: `error al realizar la peticion:${err}` });
        }
        if (!product) {
            return res.status(404).send({ message: `El producto no existe` });
        } else {
            return res.status(200).send({ product });
        }
    })
})

app.post('/api/product', (req, res) => {
    console.log("Post /api/product");
    console.log(req.body);

    let product = new Product();
    product.name = req.body.name;
    product.picture = req.body.picture;
    product.price = req.body.price;
    product.category = req.body.category;
    product.description = req.body.description;

    product.save((err, productStored) => {
        if (err) {
            res.status(500).send(`error al salvar en base de datos:${err}`);
        } else {
            res.status(200).send({ product: productStored });
        }
    });
})
app.put('/api/product/:productId', (req, res) => {
    let productId = req.params.productId;
    let update = req.body;

    Product.findByIdAndUpdate(productId, update, (err, productUpdate) => {
        if (err) {
            res.status(500).send({ message: `Error al actualizar el producto: ${err}` });
        } else {
            res.status(200).send({ product: productUpdate });
        }
    })
})

app.delete('/api/product/:productId', (req, res) => {
    let productId = req.params.productId;

    Product.findById(productId, (err, product) => {
        if (err) {
            res.status(500).send({ message: `Error al borrar producto: ${err}` });
        }
        product.remove(err => {
            if (err) {
                res.status(500).send({ message: `Error al borrar producto: ${err}` });
            }
            res.status(200).send({ messaje: "El producto ha sido eliminado" });
        })
    })

})

mongoose.connect('mongodb://127.0.0.1:27017/shop', (err, res) => {
    if (err) {
        return console.log(`error al conectar a la base de datos: ${err}`);
    } else {
        console.log("conexión establecida....")
    }
    app.listen(port, () => {
        console.log(`api corriendo en localhost:${port}`);
    })
})