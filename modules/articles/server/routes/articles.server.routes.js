'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles_collections = require('../controllers/collections-articles.server.controller'),
  articles_single = require('../controllers/single-articles.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles_collections.list)
    .post(articles_collections.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles_single.read)
    .put(articles_single.update)
    .delete(articles_single.delete);

  // Finish by binding the article middleware
  app.param('articleId', articles_single.articleByID);
};
