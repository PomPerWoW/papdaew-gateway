const services = {
  auth: {
    prefix: '/api/v1/auth',
    service: 'auth-service',
    public: [
      { path: '/login', method: 'POST' },
      { path: '/signup', method: 'POST' },
      { path: '/google', method: 'GET' },
      { path: '/google/callback', method: 'GET' },
    ],
    protected: [
      {
        path: '/profile',
        method: 'GET',
        roles: ['CUSTOMER', 'VENDOR', 'ADMIN'],
      },
    ],
  },
};

module.exports = services;
