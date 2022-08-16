export const auth = {
  '/api/v1/users/signup': {
    post: {
      tags: ['Authentication'],
      summary: 'User registration process',
      description: ' ',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/Signup',
          },
        },
      ],
      responses: {
        200: {
          description:
            'Please Check SMS sent to your number and Verify your phone number',
        },

        400: {
          description: 'User already exists',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/api/v1/users/signup/verify-otp': {
    post: {
      tags: ['Authentication'],
      summary: 'Phone number verification',
      description: 'Phone number verification ',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/VerifyOtp',
          },
        },
      ],
      responses: {
        200: {
          description:
            'Phone number successfully verified, Please proceed to login',
        },
        400: {
          description: 'Phone number already verified',
        },
        401: {
          description: 'Incorrect Otp code',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/api/v1/users/login': {
    post: {
      tags: ['Authentication'],
      summary: 'User login process',
      description: 'This will log in a user',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/Login',
          },
        },
      ],
      responses: {
        200: {
          description: 'Please Check SMS sent to your number',
        },

        400: {
          description: 'Please provide email and password!',
        },
        401: {
          description: 'Incorrect email or password',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/api/v1/users/login/verify-otp': {
    post: {
      tags: ['Authentication'],
      summary: 'Login otp code verification',
      description: 'Login otp code verification',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/VerifyOtp',
          },
        },
      ],
      responses: {
        200: {
          description: 'User logged in successfully',
        },

        400: {
          description: 'No Otp code sent or Otp has expired',
        },
        401: {
          description: 'Incorrect Otp code',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/api/v1/users/login/login-with-link': {
    post: {
      tags: ['Authentication'],
      summary: 'Request for login link',
      description:
        'This route requires to enter an email and if it is valid, a login link is sent to your email',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/LoginLink',
          },
        },
      ],
      responses: {
        200: {
          description: 'Login Link successfully sent to your email',
        },
        400: {
          description: 'Please provide your email',
        },
        404: {
          description: 'There is no user with that email address',
        },
        500: {
          description: 'There was an error sending email, Try again later!',
        },
      },
    },
  },
  '/api/v1/users/login/{otp}': {
    get: {
      tags: ['Authentication'],
      summary: 'Login link url',
      description: 'This link will log in the user',
      produces: ['application/json'],
      responses: {
        200: {
          description: 'User logged in successfully',
        },
        401: {
          description: 'Incorrect otp code',
        },
        500: {
          description: 'Internal error!',
        },
      },
    },
  },
  '/api/v1/users/logout': {
    get: {
      tags: ['Authentication'],
      summary: 'User logout process',
      description: 'This will logout a user',
      produces: ['application/json'],
      responses: {
        200: {
          description: 'success',
        },
      },
    },
  },
  '/api/v1/users/forgotPassword': {
    post: {
      tags: ['Authentication'],
      summary: 'Forgot password process',
      description:
        'This route requires to enter an email and if it is valid, a resent link is sent to your email',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/LoginLink',
          },
        },
      ],
      responses: {
        200: {
          description: 'resent link sent to your email!',
        },
        400: {
          description: 'Please provide your email',
        },
        404: {
          description: 'There is no user with that email address',
        },
        500: {
          description: 'There was an error sending email, Try again later!',
        },
      },
    },
  },
  '/api/v1/users/resetPassword/{token}': {
    patch: {
      tags: ['Authentication'],
      summary: 'Reset link url',
      description: 'This link will reset user password',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/ResetPassword',
          },
        },
      ],
      responses: {
        200: {
          description: 'Password reset successfully',
        },
        401: {
          description: 'This link is invalid or has expired!',
        },
        500: {
          description: 'Internal error!',
        },
      },
    },
  },
  '/api/v1/users/updateMyPassword': {
    patch: {
      tags: ['Authentication'],
      summary: 'Update user password',
      description:
        'This route will update the user password but the user needs to be authenticted',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Authorization',
          in: 'header',
          description: 'Authorization',
          required: true,
        },
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/UpdatePassword',
          },
        },
      ],
      responses: {
        200: {
          description: 'Password updated successfully',
        },
        401: {
          description: 'Your current password is wrong!',
        },
        500: {
          description: 'Internal error!',
        },
      },
    },
  },
  '/api/v1/users/updateProfile': {
    patch: {
      tags: ['Authentication'],
      summary: 'Update user password',
      description:
        'This route will update the user password but the user needs to be authenticted',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Authorization',
          in: 'header',
          description: 'Authorization',
          required: true,
        },
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/UpdateProfile',
          },
        },
      ],
      responses: {
        200: {
          description: 'Password updated successfully',
        },
        401: {
          description: 'Your current password is wrong!',
        },
        500: {
          description: 'Internal error!',
        },
      },
    },
  },
  '/api/v1/users/verify-account': {
    patch: {
      tags: ['Authentication'],
      summary: 'Account verification',
      description:
        'User submit ID number and ID photo and the staff review them',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Authorization',
          in: 'header',
          description: 'Authorization',
          required: true,
        },
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/AccountVerification',
          },
        },
      ],
      responses: {
        200: {
          description: 'ID submitted successfully',
        },
        400: {
          description:
            'only UNVERIFIED users are allowed to upload their document',
        },
        500: {
          description: 'Internal error!',
        },
      },
    },
  },

  '/api/v1/users/verify-user': {
    patch: {
      tags: ['Authentication'],
      summary: 'Verify User',
      description:
        'Staff member check the user ID and update user verification status accordingly',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Authorization',
          in: 'header',
          description: 'Authorization',
          required: true,
        },
        {
          name: 'Body',
          in: 'body',
          required: true,
          schema: {
            $ref: '#/definitions/VerifyUser',
          },
        },
      ],
      responses: {
        200: {
          description: 'ID submitted successfully',
        },
        400: {
          description:
            'only UNVERIFIED users are allowed to upload their document',
        },
        500: {
          description: 'Internal error!',
        },
      },
    },
  },
};

export const authDefinition = {
  Login: {
    type: 'object',
    in: 'body',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
      },
    },
  },
  Signup: {
    type: 'object',
    in: 'body',
    required: [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'gender',
      'dateOfBirth',
      'maritalStatus',
      'nationality',
      'password',
      'passwordConfirm',
    ],
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      phoneNumber: {
        type: 'string',
      },
      gender: {
        type: 'string',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        example: '2019-05-17',
      },
      maritalStatus: {
        type: 'string',
        enum: ['single', 'married', 'divorced', 'widowed'],
      },
      nationality: {
        type: 'string',
        example: 'rwanda',
      },
      password: {
        type: 'string',
        format: 'password',
      },
      passwordConfirm: {
        type: 'string',
        format: 'password',
      },
    },
  },
  VerifyOtp: {
    type: 'object',
    in: 'body',
    required: ['phone', 'otpCode'],
    properties: {
      phone: {
        type: 'string',
      },
      otpCode: {
        type: 'string',
      },
    },
  },
  LoginLink: {
    type: 'object',
    in: 'body',
    required: ['email'],
    properties: {
      phone: {
        type: 'string',
        format: 'email',
      },
    },
  },
  ResetPassword: {
    type: 'object',
    in: 'body',
    required: ['password', 'passwordConfirm'],
    properties: {
      password: {
        type: 'string',
        format: 'password',
      },
      passwordConfirm: {
        type: 'string',
        format: 'password',
      },
    },
  },
  UpdatePassword: {
    type: 'object',
    in: 'body',
    required: ['passwordCurrent', 'password', 'passwordConfirm'],
    properties: {
      passwordCurrent: {
        type: 'string',
        format: 'password',
      },
      password: {
        type: 'string',
        format: 'password',
      },
      passwordConfirm: {
        type: 'string',
        format: 'password',
      },
    },
  },
  UpdateProfile: {
    type: 'object',
    in: 'body',
    required: [],
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      maritalStatus: {
        type: 'string',
        enum: ['single', 'married', 'divorced', 'widowed'],
      },
      nationality: {
        type: 'string',
      },
    },
  },
  AccountVerification: {
    type: 'object',
    in: 'body',
    required: ['idNumber', 'idPhoto'],
    properties: {
      idNumber: {
        type: 'number',
      },
      idPhoto: {
        type: 'string',
      },
    },
  },
  VerifyUser: {
    type: 'object',
    in: 'body',
    required: ['id', 'verified'],
    properties: {
      id: {
        type: 'string',
      },
      verified: {
        type: 'string',
      },
    },
  },
};
