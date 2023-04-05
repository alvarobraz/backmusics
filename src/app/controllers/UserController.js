const User = require('../models/User');
const bcrypt = require('bcryptjs');
// const MusicCategory = require('../models/MusicCategory');
// const MusicService =  require('../services/MusicService')

module.exports = {

  async store(req, res) {
    
    try {

      const requiredFields = ['name', 'email', 'password'];
      for (const field of requiredFields) {
        console.log(requiredFields.length)
        if (!req.body[field]) {
          return res.status(400).send({ error: `Missing required field: ${field}` });
        }
      }

      const emailExists = await User.findOne({email: req.body.email});
      if(emailExists) {
        return res.status(400).send({
          error: true,
          message: 'Email already registered!'
        });
      }

      password   = req.body.password
      const hash        = await bcrypt.hash(password, 10);
      req.body.password = hash;

      const createUser = await User.create(req.body);
      return res.status(400).json(createUser)

    } catch (error) {
      return res.status(201).json({ error });
    }

  },

  async update(req, res) {
    
    try {

      const emailExists = await User.findOne({email: req.body.email});
      if(emailExists) {
        return res.status(400).send({
          error: true,
          message: 'Email already registered!'
        });
      }

      if(req.body.password !== undefined) {
        password   = req.body.password
        const hash        = await bcrypt.hash(password, 10);
        req.body.password = hash;
      }

      if(req.body.role !== undefined && req.body.role === 'admin' && req.user !== 'admin') {
        return res.status(400).send({
          error: true,
          message: 'Sorry, do you not have permission!'
        });
      }

      const updateUser = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
      return res.status(200).json(updateUser)

    } catch (error) {
      return res.status(400).json({ error });
    }

  },

  // async get(req, res) {

  //   try {

  //     const { 
  //       status,
  //       sortBy,
  //       name,
  //       limit,
  //       page,
  //     } = req.query;
  
  //     filter = {}
  //     sort = {
  //       title: 1
  //     }
  
  //     function diacriticSensitiveRegex(string = '') {
  //       return string
  //       .replace(/a/g, '[a,á,à,ä,â,ã]')
  //       .replace(/A/g, '[A,Á,À,Ä,Â,Ã]')
  //       .replace(/e/g, '[e,é,ë,è,ê,ẽ]')
  //       .replace(/E/g, '[E,É,È,Ê,Ẽ]')
  //       .replace(/i/g, '[i,í,ï,ì]')
  //       .replace(/I/g, '[I,Í,Ì]')
  //       .replace(/o/g, '[o,ó,ö,ò,ô]')
  //       .replace(/O/g, '[O,Ó,Ò,Ô]')
  //       .replace(/u/g, '[u,ü,ú,ù]')
  //       .replace(/U/g, '[U,Ü,Ú,Ù]')
  //       .replace(/c/g, '[c,ç]')
  //       .replace(/C/g, '[C,Ç]'); 
  //     }
  
  //     if(status !== undefined) {
  //       filter ={
  //         ...filter, status
  //       }
  //     }
  
  //     if(name !== undefined && name !== '') {
  //       filter ={
  //         ...filter, 
  //         $or: [
  //           { title: new RegExp(diacriticSensitiveRegex(name),'i') }, 
  //           { keyWords: new RegExp(diacriticSensitiveRegex(name),'i') }
  //         ]
  //       }
  //     }
  
  //     if(sortBy !== undefined && sortBy !==  '') {
  //       if(sortBy === 'title') {
  //         sort = {
  //           ...sort, title: 1
  //         }
  //       }
  //       if(sortBy === 'author') {
  //         sort = {
  //           ...sort, author: 1
  //         }
  //       }
  //       if(sortBy === 'keyWords') {
  //         sort = {
  //           ...sort, keyWords: 1
  //         }
  //       }
  //     }

  //     const musicSearch = await MusicService
  //     .get(filter, sort, Number(page), Number(limit))

  //     return res.json(musicSearch)

  //   } catch (error) {
  //     return res.status(400).json({ error });
  //   }
     
  // },

  // async show(req, res) {

  //   try {

  //     const musicsGetOne = await Music.findOne({ _id: req.params.id })
  //     return res.json(musicsGetOne)

  //   } catch (error) {
  //     return res.status(400).json({ error });
  //   }

  // },

  // async update(req, res) {

  //   try {

  //     if(req.body.category !== undefined) {

  //       const searchCategory = await MusicCategory.findOne({_id: req.body.category, status: 'active'})
  //       if(searchCategory === null) {
  //         return res.status(400).send({
  //           error: true,
  //           message: 'Category does not exist!'
  //         });
  //       }
  //       req.body.category = {
  //         _id: searchCategory._id,
  //         name: searchCategory.name
  //       }

  //     }

  //     const updateMusic = await Music.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true})
  //     return res.json(updateMusic)

  //   } catch (error) {
  //     return res.status(400).json({ error });
  //   }

  // },

  // async destroy(req, res) {

  //   try {

  //     const deleteMusic = await Music.findOneAndUpdate({ _id: req.params.id }, { status: "inactive" })
  //     return res.status(204).send({ message: `A musíca ${deleteMusic.title} foi desativada!` });

  //   } catch (error) {
  //     return res.status(400).json({ error });
  //   }

  // }

}
