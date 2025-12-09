/** Check if a user has a required role */

const checkRolesMiddleware = (permittedRole) => (req, res, next) => {

    if (!req.principal.roles.includes(permittedRole)) {
        return res.status(403).json({message: `Forbidden for this role`})
    }

    return next();
}

export default checkRolesMiddleware;