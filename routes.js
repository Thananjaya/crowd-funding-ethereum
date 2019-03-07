const routes = require('next-routes')();


routes
    .add('/cf/new', 'cf/new')
    .add('/cf/:address', 'cf/show')
    .add('/cf/:address/spending_requests', 'cf/requestsIndex')
    .add('/cf/:address/spending_requests/new', 'cf/requestNew');

module.exports = routes;