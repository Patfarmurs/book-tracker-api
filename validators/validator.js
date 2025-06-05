const { body, validationResult } = require('express-validator');

const userValidationRules = () => [
    body('username').isEmail().withMessage('Username must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const bookValidationRules = () => [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('publishedYear').isNumeric().withMessage('Published Year must be a number'),
    body('ISBN').notEmpty().withMessage('ISBN is required'),
    body('pages').isNumeric().withMessage('Pages must be a number'),
    body('status').isIn(['Available', 'Checked out']).withMessage('Status must be either Available or Checked out')
];

const reviewValidationRules = () => [
    body('bookId').notEmpty().withMessage('Book ID is required'),
    body('reviewer').notEmpty().withMessage('Reviewer is required'),
    body('rating').isNumeric().withMessage('Rating must be a number'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors
    });
};

module.exports = {
    userValidationRules,
    bookValidationRules,
    reviewValidationRules,
    validate
};

