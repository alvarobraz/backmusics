const Music = require('../models/Music');
const MusicCategory = require('../models/MusicCategory');
const MusicService =  require('../services/MusicService')

module.exports = {

  async store(req, res) {

    console.log(req.body.keyWords.length)

    const session = await req.conn.startSession();
    // try {

      session.startTransaction();
      const { user } = req.auth;
      if (user.role !== "admin") {
        return res.status(400).send({
          error: true,
          message: `Acesso negado, somente administradores podem criar uma música!`
        });
      }

      const requiredFields = ['title', 'author', 'descrition', 'releaseDateOf', 'category'];
      for (const field of requiredFields) {
        console.log(requiredFields.length)
        if (!req.body[field]) {
          return res.status(400).send({ error: `Campo obrigatório ausente!: ${field}` });
        }
      }

      // var keyWords = []
      // if(req.body.keyWords !== undefined) {
      //   req.body.keyWords.map((key, index)=>{
      //     keyWords.push(key)
      //   })
      // }
      // req.body.keyWords = keyWords;

      const titlenameExists = await Music.findOne({title: req.body.title});
      if(titlenameExists) {
        return res.status(400).send({
          error: true,
          message: 'Título já registrado!'
        });
      }

      const searchCategory = await MusicCategory.findOne({_id: req.body.category, status: 'active'})
      if(searchCategory === null) {
        return res.status(400).send({
          error: true,
          message: 'A categporia não existe!'
        });
      }
      req.body.category = {
        _id: searchCategory._id,
        name: searchCategory.name
      }

      const createMusic = await Music.create([req.body], { session });
      await session.commitTransaction();
      return res.json(createMusic)

    // } catch (error) {
    //   console.log(error);
    //   await session.abortTransaction();
    //   res.status(400).json(error);
    // }
    // session.endSession();

  },

  async get(req, res) {

    try {

      const { 
        status,
        sortBy,
        name,
        releaseDateOf,
        category,
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
  
      if(name !== undefined && name !== '') {
        filter ={
          ...filter, 
          $or: [
            { title: new RegExp(diacriticSensitiveRegex(name),'i') },
            { author: new RegExp(diacriticSensitiveRegex(name),'i') },
            { keyWords: new RegExp(diacriticSensitiveRegex(name),'i') },
            { 'category.name': new RegExp(diacriticSensitiveRegex(name),'i') }
          ]
        }
      }
  
      if(sortBy !== undefined && sortBy !==  '') {
        if(sortBy === 'title') {
          sort = {
            ...sort, title: 1
          }
        }
        if(sortBy === 'author') {
          sort = {
            ...sort, author: 1
          }
        }
        if(sortBy === 'keyWords') {
          sort = {
            ...sort, keyWords: 1
          }
        }
      }

      if(releaseDateOf !== undefined && releaseDateOf !== '') {
        filter ={
          ...filter,
          releaseDateOf: { $gte: releaseDateOf }
        }
      }

      if(category !== undefined && category !== '') {
        filter ={
          ...filter,
          'category._id': category
        }
      }

      const musicSearch = await MusicService
      .get(filter, sort, Number(page), Number(limit))

      return res.json(musicSearch)

    } catch (error) {
      return res.status(400).json({ error });
    }
     
  },

  async show(req, res) {

    try {

      const musicsGetOne = await Music.findOne({ _id: req.params.id })
      return res.json(musicsGetOne)

    } catch (error) {
      return res.status(400).json({ error });
    }

  },

  async update(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();
      const { user } = req.auth;
      if (user.role !== "admin") {
        return res.status(400).send({
          error: true,
          message: `Acesso negado, somente administradores podem editar uma música!`
        });
      }

      if(req.body.category !== undefined) {

        const searchCategory = await MusicCategory.findOne({_id: req.body.category, status: 'active'})
        if(searchCategory === null) {
          return res.status(400).send({
            error: true,
            message: 'Category does not exist!'
          });
        }
        req.body.category = {
          _id: searchCategory._id,
          name: searchCategory.name
        }

      }

      await Music.updateOne({ _id: req.params.id }, req.body, { session})
      await session.commitTransaction();
      return res.json({ message: "Música alterada!" })

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);;
    }
    session.endSession();

  },

  async destroy(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();
      const { user } = req.auth;
      if (user.role !== "admin") {
        return res.status(400).send({
          error: true,
          message: `Acesso negado, somente administradores podem deletar uma música!`
        });
      }
      await Music.findOneAndUpdate({ _id: req.params.id }, { status: "inactive" })
      await session.commitTransaction();
      return res.status(204).send({ message: `A musíca foi desativada!` });

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  }

}
