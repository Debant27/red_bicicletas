const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'gianni47@ethereal.email',
        pass: 'f2Wg9CDee4hZTVmfCN'
    }
};

module.exports = nodemailer.createTransport(mailConfig);