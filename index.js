const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Corrected the typo

const stripe = require('stripe')(process.env.STRIPE_KEY);
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "success"
    });
});

app.post("/payment/create", async (req, res) => {
    const total =parseInt( req.query.total);
    if (total > 0) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: total,
                currency: "usd",
            });
            res.status(201).json({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    } else {
        res.status(403).json({ message: "total sum must be greater than 0" });
    }
});

app.listen(3000, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log('Server running on port 3000');
    }
});

