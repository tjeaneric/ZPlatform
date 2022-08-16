const users = {
  '/api/v1/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      description: 'This route will get all users',
      produces: ['application/json'],
      parameters: [
        {
          name: 'Authorization',
          in: 'header',
          description: 'Authorization',
          required: true,
        },
      ],

      responses: {
        200: {
          description: 'success',
        },
      },
    },
  },
};

export default users;
