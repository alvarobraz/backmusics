const MusicCategory = require('../models/MusicCategory');
const MusicCategoryService =  require('../services/MusicCategoryService')
module.exports = {

  async store(req, res) {

    try {

      const requiredFields = ['name'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).send({ error: `Missing required field: ${field}` });
        }
      }

      const nameExists = await MusicCategory.findOne({ name: req.body.name });

      if(nameExists) {
        return res.status(400).send({
          error: true,
          message: 'Category already registered!'
        });
      }

      const createCategory = await MusicCategory
      .create({ name: req.body.name });

      return res.json(createCategory)

    } catch (error) {
      return res.status(400).json({ error });
    }
     
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
     
  }

}
