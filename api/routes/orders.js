const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orders')

router.get('/', (req, res, next) => {
    Order.find()
    .select('quantity _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    quantity: doc.quantity,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        orderId: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity
    });
    order
    .save()
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /orders',
        createOrder: {
            quantity: result.quantity,
            _id: result._id,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders' + result._id
            }
        }
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .select('quantity _id')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                order: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for ID'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({
        _id: id
    })
    .exec()
    .then(res => {
        console.log(docs);
        if (docs.length >= 0) {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    data: {
                        quantity: 'Number'
                    }
                }
            });
        } else {
            res.status(404).json({
                message: 'No entries found.'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

module.exports = router;
