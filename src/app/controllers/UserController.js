const User = require('../models/User');
const Music = require('../models/Music');
const UserService =  require('../services/UserService')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

  async store(req, res) {
    
    const session = await req.conn.startSession();
    try {

      session.startTransaction();
      const requiredFields = ['name', 'email', 'password'];
      for (const field of requiredFields) {
        console.log(requiredFields.length)
        if (!req.body[field]) {
          return res.status(400).send({ error: `Campo obrigatório ausente!: ${field}` });
        }
      }

      const emailExists = await User.findOne({email: req.body.email});
      if(emailExists) {
        return res.status(400).send({
          error: true,
          message: 'Email já registrado!'
        });
      }

      password   = req.body.password
      const hash        = await bcrypt.hash(password, 10);
      req.body.password = hash;

      user = req.body

      req.body.token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8), user }, process.env.SECRET_API_KEY);

      const createUser = await User.create([req.body], { session });
      await session.commitTransaction();
      return res.json(createUser)

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  },

  async get(req, res) {

    // try {

      const { user } = req.auth;
      if (user.role !== "admin") {
        return res.status(400).send({
          error: true,
          message: `Acesso negado, somente administradores podem listar inscritos!`
        });
      }

      const { 
        status,
        sortBy,
        name,
        role,
        createdAt,
        limit,
        page,
      } = req.query;
  
      filter = {}
      sort = {
        title: 1
      }
  
      function diacriticSensitiveRegex(string = '') {
        return string
        .replace(/a/g, '[a,á,à,ä,â,ã]')
        .replace(/A/g, '[A,Á,À,Ä,Â,Ã]')
        .replace(/e/g, '[e,é,ë,è,ê,ẽ]')
        .replace(/E/g, '[E,É,È,Ê,Ẽ]')
        .replace(/i/g, '[i,í,ï,ì]')
        .replace(/I/g, '[I,Í,Ì]')
        .replace(/o/g, '[o,ó,ö,ò,ô]')
        .replace(/O/g, '[O,Ó,Ò,Ô]')
        .replace(/u/g, '[u,ü,ú,ù]')
        .replace(/U/g, '[U,Ü,Ú,Ù]')
        .replace(/c/g, '[c,ç]')
        .replace(/C/g, '[C,Ç]'); 
      }
  
      if(status !== undefined) {
        filter ={
          ...filter, status
        }
      }

      if(role !== undefined) {
        filter ={
          ...filter, role
        }
      }
  
      if(name !== undefined && name !== '') {
        filter ={
          ...filter, 
          $or: [
            { name: new RegExp(diacriticSensitiveRegex(name),'i') },
            { email: new RegExp(diacriticSensitiveRegex(name),'i') },
            { 'category.name': new RegExp(diacriticSensitiveRegex(name),'i') }
          ]
        }
      }
  
      if(sortBy !== undefined && sortBy !==  '') {
        if(sortBy === 'name') {
          sort = {
            ...sort, name: 1
          }
        }
        if(sortBy === 'email') {
          sort = {
            ...sort, email: 1
          }
        }
      }

      if(createdAt !== undefined && createdAt !== '') {
        filter ={
          ...filter,
          createdAt: { $gte: createdAt }
        }
      }

      const userSearch = await UserService
      .get(filter, sort, Number(page), Number(limit))

      return res.json(userSearch)

    // } catch (error) {
    //   return res.status(400).json({ error });
    // }
     
  },

  async show(req, res) {

    try {

      const { user } = req.auth;

      if(user.role === 'admin') {
        const userGetOne = await User.findOne({ _id: req.params.id })
        if(userGetOne === null) {
          return res.status(400).send({
            error: true,
            message: 'ID informado não encontrado!!'
          });
        }
        return res.json(userGetOne)
      }

      if(user.role !== 'admin') {
        if(req.params.id === 'user') {
          const userGetOne = await User.findOne({ _id: user._id })
          return res.json(userGetOne)
        }
        return res.status(400).send({
          error: true,
          message: 'Inscrição não encontrada!'
        });
      }

    } catch (error) {
      console.log(error)
      if(error.kind) {
        return res.status(400).send({
          error: true,
          message: 'O ID deve estar em um formato correto!'
        });
      }
      return res.status(400).json({ error });
    }

  },

  async update(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();
      const { user } = req.auth;

      const emailExists = await User.findOne({email: req.body.email});
      if(emailExists) {
        return res.status(400).send({
          error: true,
          message: 'Email já registrado!'
        });
      }

      if(req.body.password !== undefined) {
        password   = req.body.password
        const hash        = await bcrypt.hash(password, 10);
        req.body.password = hash;
      }

      if(req.body.role !== undefined && req.body.role === 'admin' && user.role !== 'admin') {
        return res.status(400).send({
          error: true,
          message: 'Usuários comuns não possuem autorização para criar a aministradores!'
        });
      }

      
      if(req.body.favoritesMusic !== undefined && req.body.edit === 'ok') {

        req.body.favoritesMusics = []

        const searchFavoriteMusic = await Music.findOne({ _id: req.body.favoritesMusic })
        const searchFavoriteMusicById = await User.findOne({favoritesMusics: { $elemMatch: { _id: req.body.favoritesMusic } } })
        if(searchFavoriteMusicById === null) {
          if(searchFavoriteMusic !== null) {
            req.body.favoritesMusics.push({
              _id: searchFavoriteMusic._id,
              title: searchFavoriteMusic.title
            })
          }
        }
        else {
          return res.status(400).send({
            error: true,
            message: 'Música favorita já cadastrada!!'
          });
        }

        const userGetOne = await User.findOne({ _id: user._id })
        if(userGetOne.favoritesMusics.length !== 0) {
          for (let fm = 0; fm < userGetOne.favoritesMusics.length; fm++) {
            req.body.favoritesMusics.push({
              _id: userGetOne.favoritesMusics[fm]._id,
              title: userGetOne.favoritesMusics[fm].title
            })
          } 
        }
        // favoriteCount = 0
        let favoriteCount = searchFavoriteMusic.favoriteCount + 1
        await Music.updateOne({  _id: req.body.favoritesMusic }, { favoriteCount }, { session });


      }

      if(req.body.favoritesMusic !== undefined && req.body.edit === 'delete') {
        
        req.body.favoritesMusics = []
        const searchFavoriteMusicById = await User.findOne({favoritesMusics: { $elemMatch: { _id: req.body.favoritesMusic } } })

        if(searchFavoriteMusicById !== null) {
          if(searchFavoriteMusicById.favoritesMusics.length !== 0) {
            for (let fm = 0; fm < searchFavoriteMusicById.favoritesMusics.length; fm++) {
              if(searchFavoriteMusicById.favoritesMusics[fm]._id != req.body.favoritesMusic) {
                req.body.favoritesMusics.push({
                  _id: searchFavoriteMusicById.favoritesMusics[fm]._id,
                  title: searchFavoriteMusicById.favoritesMusics[fm].title
                })
              }
            } 
          }
        }
        else {
          return res.status(400).send({
            error: true,
            message: 'Nenhuma música favorita encontrada para deletar!'
          });
        }

        const searchFavoriteMusic = await Music.findOne({ _id: req.body.favoritesMusic })
        let favoriteCount = searchFavoriteMusic.favoriteCount -1
        await Music.updateOne({  _id: req.body.favoritesMusic }, { favoriteCount }, { session });
        
      }

      if(user.role === 'admin') {

        const updateUser = await User.updateOne({ _id: req.params.id }, req.body, { session });
        await session.commitTransaction();
        if(updateUser === null) {
          return res.status(400).send({
            error: true,
            message: 'ID informado não encontrado!'
          });
        }
        return res.json({message: "ok"})
      }

      if(user.role !== 'admin') {
        if(req.params.id === 'user') {
          await User.updateOne({ _id: user._id }, req.body, { session });
          await session.commitTransaction();
          return res.json({message: "ok"})
        }
        return res.status(400).send({
          error: true,
          message: 'Inscrição não encontrada!'
        });
      }
            

    } catch (error) {
      console.log(error)
      if(error.kind) {
        return res.status(400).send({
          error: true,
          message: 'O ID deve estar em um formato correto!'
        });
      }
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  },

  async destroy(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();
      const { user } = req.auth;

      if (user.role === "admin") {
        const deleteUser = await User.findOneAndUpdate({ _id: req.params.id }, { status: "inactive" })
        if(deleteUser === null) {
          return res.status(400).send({
            error: true,
            message: 'ID informado não encontrado!'
          });
        }
        await session.commitTransaction();
        return res.json({message: "ok"})
      }
      if (user.role !== "admin") {
        if(req.params.id === 'user') {
          await User.findOneAndUpdate({ _id: user._id }, { status: "inactive" })
          await session.commitTransaction();
          return res.json({ message: "ok" })
        }
        return res.status(400).send({
          error: true,
          message: 'Inscrição não encontrada!'
        });
      }

    } catch (error) {
      console.log(error)
      if(error.kind) {
        return res.status(400).send({
          error: true,
          message: 'O ID deve estar em um formato correto!'
        });
      }
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  }

}
