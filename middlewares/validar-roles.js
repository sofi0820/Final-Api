
const roles = (req, res = response, next ) => {
    if (!req.usuario) {
        return res.status(500).json({ message: 'Se requiere verificar el rol sin validr el token'});
    }

    const { role, nombre } = req.usuario;
    if ( role !== 'Administrador') {
        return res.status(401).json({ message:  ` ${nombre} no es administrador - no puede hacer eso`})
    }
next()
};

const tieneRol = ( ...roles ) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({ message: 'Se requiere verificar el rol sin validr el token'});
        }
        
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({ message: `El servicio requiere uno de estos roles: ${roles}` });
        }
        console.log(roles, req.usuario.rol);

        next();
    }
}


module.exports = {roles, tieneRol};