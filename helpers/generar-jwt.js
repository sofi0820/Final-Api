const jwt = require('jsonwebtoken');



const generarJwt = (uid = '',nombre='', correo = '', rol='',img='', estado='') => {          
    return new Promise((resolve, reject) => {
        const payload = { uid, nombre, correo, rol, img, estado };
        // console.log('UID:', uid);
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log('Error al generar el token:', err);
                reject('No se puede generar el token');
            } else {
                resolve(token);
                console.log(payload);
                const prueba = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
                console.log(prueba);
            }
        });
    });
};

module.exports = { generarJwt }