const nodemailer = require('nodemailer');

const mail = {
    user: process.env.MAIL,
    pass:  process.env.PASSWORD_MAIL,
}

let transporter = nodemailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
    port: 2525,
    tls: {
        rejectUnauthorized: false
    },
    secure: false, // true for 465, false for other ports
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    },
  });

  const sendEmail = async (email, subject, html) => {
    try {
        await transporter.sendMail({
            from: `Dulce Sofia <${ mail.user }>`, // sender address
            to: email, // list of receivers
            subject: "Bienvenido", // Subject line
            text: "Hola amigo gracias por registrase en la pagina", // plain text body
            html, // html body
        });
    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
  }

  const getTemplate = (name, token) => {
    const endpoint = process.env.ENDPOINT_CONFIRM
      return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://i.imgur.com/eboNR82.png" alt="">
            <h2>Hola ${ name }</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="${ENDPOINT_CONFIRM}/${ token }"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `;
  }

  module.exports = {
    sendEmail,
    getTemplate
  }