exports.allowOnly = (allowedFields = []) => {
    return (req, res, next) => {
        const requestFields = Object.keys(req.body);
        const invalidFields = requestFields.filter((field) => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: "invalid feilds in request",
                invalidFields
            })
        }
        next();
    }
    
}