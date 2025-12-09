/**
 * This middleware combines other middlewares into one
 */
const checkAllPermissionsMiddleware = (...middlewares) => {
    return async (req, res, next) => {
        let lastError = null;

        for (const middleware of middlewares) {
            let success = false; // creating a flag

            const mockNext = () => {
                success = true;
            };

            // creating a mock response object
            const mockRes = {
                status: (code) => ({
                    json: (message) => {
                        lastError = { code, message };
                        return mockRes;
                    }
                })
            };

            await middleware(req, mockRes, mockNext);

            // if at least one check passed, we move to the next middleware
            if (success) {
                return next();
            }
        }

        // if all checks failed - return an error
        return res.status(lastError?.code || 403).json(lastError?.message || { message: 'Forbidden' });
    };
};

export default checkAllPermissionsMiddleware;
