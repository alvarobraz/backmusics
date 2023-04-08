const MusicCategory = require('../models/MusicCategory');
const Music = require('../models/Music');
const MusicCategoryService =  require('../services/MusicCategoryService')
module.exports = {

  async store(req, res) {

    const session = await req.conn.startSession();
    try {

      session.startTransaction();
      const { user } = req.auth;
      if (user.role !== "admin") {
        return res.status(400).send({
          error: true,
          message: `Acesso negado, somente administradores podem criar uma categoria!`
        });
      }

      const requiredFields = ['name'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).send({ error: `Campo obrigatório ausente!: ${field}` });
        }
      }

      const nameExists = await MusicCategory.findOne({ name: req.body.name });

      if(nameExists) {
        return res.status(400).send({
          error: true,
          message: 'Categoria já registrada!'
        });
      }

      const createCategory = await MusicCategory
      .create([ req.body ], { session });
      await session.commitTransaction();
      return res.json(createCategory)

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  },

  async get(req, res) {

    try {

      const { 
        status,
        sortBy,
        name,
        limit,
        page,
      } = req.query;

    filter = {}
    sort   = {
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
        ...filter, name: new RegExp(diacriticSensitiveRegex(name),'i')
      }
    }

    if(sortBy !== undefined && sortBy !==  '') {
      if(sortBy === 'name') {
        sort = {
          ...sort, title: 1
        }
      }
    }

    const musicCategorySearch = await MusicCategoryService
    .get(filter, sort, Number(page), Number(limit))

    return res.json(musicCategorySearch)

    } catch (error) {
      return res.status(400).json({ error });
    }
     
  },

  async show(req, res) {

    try {

      const getOneCatecoryMusic = await MusicCategory.findOne({ _id: req.params.id })
      return res.json(getOneCatecoryMusic)

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
          message: `Acesso negado, somente administradores podem atualizar uma categoria!`
        });
      }

      await MusicCategory.updateOne({ _id: req.params.id }, req.body, { session })
      await session.commitTransaction(); 
      return res.json({ message: "Categoria alterada!" })
     

    } catch (error) {
      console.log(error);
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

      if (user.role !== "admin") {
        return res.status(400).send({
          error: true,
          message: `Acesso negado, somente administradores podem deletar uma categoria!`
        });
      }

      const searchMusicWithCategory = await Music.find({ "category._id": { $eq: req.params.id } })

      if(searchMusicWithCategory.length !== 0) {
        for (let sc = 0; sc < searchMusicWithCategory.length; sc++) {
          _idMusic = searchMusicWithCategory[sc]._id;
          await Music.updateOne({ _id: _idMusic }, {category: {}}, { session })
        }
      }

      await MusicCategory.updateOne({ _id: req.params.id }, { status: "inactive" }, { session })
      await session.commitTransaction();
      return res.status(204).send({ message: `A Categoria foi desativada!` });

    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      res.status(400).json(error);
    }
    session.endSession();

  }

}
