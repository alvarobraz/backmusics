const express = require('express');
const routes = express.Router();

const MusicCategoryController = require('./app/controllers/MusicCategoryController');
const MusicController = require('./app/controllers/MusicController');
const UserController = require('./app/controllers/UserController');
const AuthController = require('./app/controllers/AuthController');
const auth = require("./app/middlewares/auth");

// MUSICCATEGORY
routes.post(
  "/categorias", 
  MusicCategoryController.store
);

routes.get(
  "/categorias", 
  MusicCategoryController.get
);

routes.get(
  "/categorias/:id",
  MusicCategoryController.show
);

routes.put(
  "/categorias/:id",
  MusicCategoryController.update
);

routes.delete(
  "/categorias/:id",
  MusicCategoryController.destroy
);

//MUSICS
routes.post(
  "/musicas", 
  MusicController.store
);

routes.get(
  "/musicas", 
  MusicController.get
);

routes.get(
  "/musicas/:id",
  MusicController.show
);

routes.put(
  "/musicas/:id",
  MusicController.update
);

routes.delete(
  "/musicas/:id",
  MusicController.destroy
);

// USER
routes.post(
  "/inscritos", 
  UserController.store
);

routes.put(
  "/inscritos/:id", 
  auth,
  UserController.update
);

// LOGIN
routes.post("/login", AuthController.login);

module.exports = routes;
