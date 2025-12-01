const errorMiddleware = (err, req, res, _next) => {
    console.log(err.stack);
    const contains = err.message.includes('not found');

    if (err.message && contains) {
        return res.status(404).json({
            status: 'Not found',
            code: 404,
            message: err.message,
            path: req.path
        })
    }

    if (err.message && err.message.includes('duplicate key error')) {
        return res.status(409).json({
            status: 'Conflict', // todo seems not secure to return 409 for user
            code: 409,
            message: err.message, // todo seems not secure to return the whole message
        })
    }

    return res.status(500).json(
        {
            status: 'Internal server error',
            code: 500,
            message: 'Something went wrong',
            path: req.path
        }
    )
}

export default errorMiddleware;