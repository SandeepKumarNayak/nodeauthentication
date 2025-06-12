import Joi from "joi";


export const signUpSchemaValidation = Joi.object({
    email:Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
        tlds:{allow:['com','net','org','io']}
    }),
    password:Joi.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'))
    .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one digit, and be at least 6 characters long.'
    })
})


export const acceptCodeSchemaValidation = Joi.object({
    email:Joi.string().min(6).max(60).required().email({
        tlds:{allow:['com','net','org','io']}
    }),
    code:Joi.number().required()
})

export const changePasswordSchemaValidator = Joi.object({
    oldPassword:Joi.string()
    .required()    
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'))
    .messages({
        'string.pattern.base': 'Old password must contain at least one uppercase letter, one lowercase letter, and one digit, and be at least 6 characters long.'
    }),
    newPassword:Joi.string()    
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'))
    .messages({
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one digit, and be at least 6 characters long.'
    })
    
})


export const forgotPasswordSchemaValidator = Joi.object({
    email:Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
        tlds:{allow:['com','net','org','io']}
    }),
    newPassword:Joi.string()    
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'))
    .messages({
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one digit, and be at least 6 characters long.'
    })  ,
    code:Joi.number().required()    
    

})



export const postSchemaValidator = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Title must be at least 3 characters long.',
            'string.max': 'Title must not exceed 100 characters.'
        }),
    description: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            'string.min': 'Description must be at least 10 characters long.',
            'string.max': 'Description must not exceed 500 characters.'
        }),
        userId: Joi.string()
        .required()
        .messages({
            'string.empty': 'User ID is required.'
        })
})