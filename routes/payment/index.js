const SavedCards = require('../../models/SavedCards');
const {randomUUID} = require("crypto");
const { Client, Environment, ApiError } = require("square");
const express = require('express');
const schedule = require("node-schedule");
const {createPaymentRequest} = require("../../services/payment");
const {bookAppointment} = require("../../services/booking");
const router = express.Router();

BigInt.prototype.toJSON = function() {return this.toString()}

const { cardsApi, customersApi, paymentsApi } = new Client({
    accessToken: process.env.SQUAREUP_ACCESS,
    environment: Environment.Production,
    timeout: 30000
});

router.post('/make-purchase', async (req, res, next) => {
    const customerBody = {
        idempotencyKey: randomUUID(),
        emailAddress: req.body.userEmail
    }

    try {
        const {result: {customer: {id: customerId}}} = await customersApi.createCustomer(customerBody);

        const cardBody = {
            idempotencyKey: randomUUID(),
            sourceId: req.body.sourceId,
            card: {
                customerId: customerId,
            }
        }
        const {result: {card}} = await cardsApi.createCard(cardBody);

        const cardDetails = {
            ...card,
            user_email: req.body.userEmail
        }
        const savedCard = new SavedCards(cardDetails);
        savedCard.save();

        const bookingId = await bookAppointment(req.body);


        // const now = new Date();
        // // const futureDate = new Date(now.getTime() + (23 * 60 + 59) * 60 * 1000);
        // const futureDate = new Date(now.getTime() + 60 * 1000);
        // const job = schedule.scheduleJob(futureDate, () => createPaymentRequest(customerId, card.id, bookingId, req.body.accessToken));

        res.json({
            data: bookingId
        });
    } catch (e) {
        console.log(e);
        res.json({
            message: 'Something went wrong',
            errorLog: JSON.toString(e)
        })
    }
});

module.exports = router;