const dev = {
    service: "gmail",
    auth: {
        user: process.env.DEV_NODEMAILER_USER,
        pass: process.env.DEV_NODEMAILER_PASS,
    },
};

const production = {
    service: "gmail",
    auth: {
        user: process.env.PRODUCT_NODEMAILER_USER,
        pass: process.env.PRODUCT_NODEMAILER_PASS,
    },
};

const configs = { dev, production };
const env = process.env.NODE_EV || "dev";

module.exports = configs[env];
