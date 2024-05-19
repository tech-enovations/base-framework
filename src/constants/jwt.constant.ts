export const JWT_CONSTANT = {
  STRATEGIES: {
    CUSTOMER_TOKEN: 'jwt_customer_token',
    REFRESH_CUSTOMER_TOKEN: 'jwt_refresh_customer_token',
  },
  EXPIRE_SECONDS: 10 * 60 * 60,
  ACCESS_TOKEN_EXPIRE: '5m',
  COOKIE: {
    PATH: '/api/customers/refresh',
    NAME: 'refreshToken',
  },
};
