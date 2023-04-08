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
  auth, 
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
  auth,
  MusicCategoryController.update
);

routes.delete(
  "/categorias/:id",
  auth,
  MusicCategoryController.destroy
);

//MUSICS
routes.post(
  "/musicas",
  auth, 
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
  auth,
  MusicController.update
);

routes.delete(
  "/musicas/:id",
  auth,
  MusicController.destroy
);

// USER
routes.post(
  "/inscritos", 
  UserController.store
);

routes.get(
  "/inscritos",
  auth, 
  UserController.get
);

routes.get(
  "/inscritos/:id",
  auth, 
  UserController.show
);

routes.put(
  "/inscritos/:id", 
  auth,
  UserController.update
);

routes.delete(
  "/inscritos/:id",
  auth,
  UserController.destroy
);



// AUTH
routes.post("/login", AuthController.login);
routes.put("/first-access/", auth, AuthController.firstAccess);
routes.put("/change-password/", auth, AuthController.changePassword);




module.exports = routes;
