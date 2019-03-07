const routes = require('next-routes')();


routes
    .add('/cf/new', 'cf/new')
    .add('/cf/:address', 'cf/show');

module.exports = routes;