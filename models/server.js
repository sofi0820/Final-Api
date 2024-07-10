const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const proveedor = require('../routes/proveedorRoutes');
const producto = require('../routes/productoRoutes');
const compra = require('../routes/compraRoutes');
const venta = require ('../routes/ventaRoutes');
const usuario = require ('../routes/usuarioRoutes');
const auth = require('../routes/authRoutes');


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 8080;

        // Conexión
        this.dbConnection();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async dbConnection() {
        try {
            this.connection = await mysql.createConnection({
                host: '127.0.0.1',
                user: 'root',
                password: '',
                database: 'api',
            });
            console.log('Conexión a la base de datos exitosa.');
        } catch (error) {
            console.error('No se pudo conectar a la base de datos:', error);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }



    routes() {
        this.app.use('/proveedores', proveedor);
        this.app.use('/productos', producto);
        this.app.use('/compras', compra);
        this.app.use('/ventas', venta);
        this.app.use('/usuarios', usuario);
        // Ruta del login
        this.app.use('/auth', auth);
    }
    
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
