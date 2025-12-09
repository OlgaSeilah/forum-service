import User from "../model/user.model.js";

const authenticationMiddleware = async (req, res, next) => {
    if (!req.path.includes('/register') &&
        !req.path.includes('/forum/posts') ) {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Basic ')) {
            return res.status(401).json({message: 'Authorization required'});
        }

        const token = authorizationHeader.split(' ')[1];
        const decodedToken = Buffer.from(token, 'base64').toString('ascii');
        const [login, password] = decodedToken.split(':');
        const userData = await User.findById(login);

        if(!userData || !(await userData.comparePassword(password))) {
            return res.status(401).json({message: 'Invalid credentials'});
        }

        req.headers.authorization = '';
        req.principal = {username: login, roles: userData.roles};
    }
    return next();
}

export default authenticationMiddleware;