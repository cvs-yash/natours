module.exports = (err, req, res, next) => {
    console.error('ERROR 💥', err); // always log full error

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development → detailed response
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        });
    } 
    // Production → clean message only
    else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message || 'Something went very wrong!'
        });
    }
};