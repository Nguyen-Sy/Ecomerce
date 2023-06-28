"use strict";
const nodemailer = require("nodemailer");
const mailGen = require("mailgen");
const path = require("path");

const config = require("../configs/config.nodemailer");

class nodeMailerSevice {
    static sendMail = async ({ emailBody, receiver, mailSubject }) => {
        let transporter = nodemailer.createTransport(config);

        const mailGenerator = new mailGen({
            theme: {
                path: path.resolve("public/assets/nodemailer/theme.html"),
            },
            product: {
                name: "Nguyen-Sy",
                link: "#",
                logo: "https://play-lh.googleusercontent.com/bJzyZoIRTqw-oFBOVuLmiyqDMOh6z0owzw5fpnYe_4b_vu6s5-MR0CzpLiQPmCN3ipo",
                logoHeight: "150px",
                copyright: "Copyright © 2023 Nguyen-Sy. All rights reserved.",
            },
        });

        const mail = mailGenerator.generate(emailBody);

        const mailConfig = {
            from: config.auth.user, // sender address
            to: receiver.email,
            subject: mailSubject, // Subject line
            html: mail, // html body
        };

        transporter
            .sendMail(mailConfig)
            .then(() => {
                console.log(`sendMail successfully to ${receiver.email}`);
                return "success";
            })
            .catch((err) => {
                throw new Error(err);
            });
    };

    static sendOTPEmail = async ({ OTP, receiver }) => {
        const encodeVerify = Buffer.from(
            `${OTP}|${receiver.email}|verify`,
            "utf-8"
        ).toString("base64");

        const emailBody = {
            body: {
                title: "Welcome to Nguyen-Sy Ecommerce website",
                name: receiver.name ? receiver.name : receiver.email,
                intro: [
                    `Thank you for register. Use the following OTP to complete your Sign Up procedures.`,
                    `OTP is valid for 5 minutes. OTP: ${OTP}`,
                    `Or click the following button to finish your register`,
                ],
                action: {
                    button: {
                        color: "#48cfad", // Optional action button color
                        text: "Confirm your account",
                        link: `http://localhost:4040/v1/api/shop/verify/${encodeVerify}`,
                    },
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help",
            },
        };

        await this.sendMail({
            emailBody,
            receiver,
            mailSubject: "Verify OTP for register account",
        });
    };

    static sendReceiptEmail = async ({ order, receiver }) => {
        const products = order.order_products.map((e) => {
            const { name, price, quantity } = e.item_products;
            return {
                Name: name,
                Quantity: quantity,
                "Total price": `${price} vnđ`,
            };
        });

        const emailBody = {
            body: {
                title: "Thank You.",
                name: receiver.name ? receiver.name : receiver.email,
                intro: `Your order has been processed successfully.`,
                outro: `You can check the status of your order and move in your dashboard: `,
                action: {
                    button: {
                        color: `#22BC66`,
                        text: "Going to dashboard",
                        link: `#`,
                    },
                },
                table: {
                    title: "Your order information: ",
                    data: products,
                    columns: {
                        customWidth: {
                            Quantity: "10%",
                            "Total-price": "15%",
                        },
                    },
                },
            },
        };

        await this.sendMail({
            emailBody,
            receiver,
            mailSubject: "Nguyen-Sy Shop order notify",
        });
    };

    static sendForgotPasswordEmail = async ({ OTP, receiver }) => {
        const encodeForgotPass = Buffer.from(
            `${OTP}|${receiver.email}|forgot-password`,
            "utf-8"
        ).toString("base64");

        const emailBody = {
            body: {
                title: "Password change request",
                name: receiver.name ? receiver.name : receiver.email,
                intro: [
                    `We've received a password change request for your Nguyen-Sy Shop account.`,
                    `OTP is valid for 5 minutes. OTP: ${OTP}`,
                    `Or click the following button to finish your change password`,
                ],
                action: {
                    button: {
                        color: "#48cfad", // Optional action button color
                        text: "Change your account password",
                        link: `http://localhost:4040/v1/api/shop/forgotpass/${encodeForgotPass}`,
                    },
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help",
            },
        };

        await this.sendMail({
            emailBody,
            receiver,
            mailSubject: "Password change request",
        });
    };
}

module.exports = nodeMailerSevice;
