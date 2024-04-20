const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
    console.log("entered payment");
    try {
        const newPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            metadata: {
                company: "Garden Beans"
            }
        });

        res.status(200).json({ success: true, client_secret: newPayment.client_secret });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const sendAPIKey = async (req, res) => {
    try {
        res.status(200).json({
            stripeAPIKey: process.env.STRIPE_API_KEY,
        });
    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message,
        });
    }

}

module.exports = {
    payment, sendAPIKey
}