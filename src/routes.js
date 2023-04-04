const express = require('express');
const routes = express.Router();

const MusicCategoryController = require('./app/controllers/MusicCategoryController');
const MusicController = require('./app/controllers/MusicController');

routes.post(
  "/categorias", 
  MusicCategoryController.store
);

routes.get(
  "/categorias", 
  MusicCategoryController.get
);


routes.post(
  "/musicas", 
  MusicController.store
);

routes.get(
  "/musicas", 
  MusicController.get
);

module.exports = routes;