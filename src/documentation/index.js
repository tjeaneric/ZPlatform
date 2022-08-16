import welcome from './welcome';
import { auth, authDefinition } from './authentication';
import users from './user';

const paths = {
  ...welcome,
  ...auth,
  ...users,
};

const definitions = {
  //definitions
  ...authDefinition,
};

const config = {
  swagger: '2.0',
  info: {
    title: 'ZPlatform API ',
    description: 'API for ZPlatform',
    version: '1.0.0',
    contact: {
      name: 'Jean Eric TUYISHIMIRE',
      email: 'ericjohn415@gmail.com',
      url: 'localhost:3000/api/v1/documentation',
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },

  schemes: ['HTTP', 'HTTPS'],

  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
    ApiKeyAuth: {
      type: 'apiKey',
      name: 'refreshToken',
      in: 'header',
    },
  },

  servers: [
    {
      url: 'http://localhost:3000',
      name: 'Development server',
    },
  ],

  paths,
  definitions,
};

export default config;
