const MusicCategory      = require('../models/MusicCategory');

module.exports = {

  async get(
    filter,
    sort,
    page, 
    limit,
    pages
  ) {

    try {
      
      const musicCategorysSearch = await MusicCategory
      .find(filter)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit))
      .sort(sort)
      .collation({
        locale : "pt"
      })
      
      const musicCategoryCount = await MusicCategory
      .find(filter)

      const countmusicCategorysSearch = await musicCategoryCount.length;

      const pagesFloat = (Number(countmusicCategorysSearch)/limit);
      pagesFloat_a     = pagesFloat.toString();
      pagesFloat_a     = pagesFloat_a.split('.')
      pagesFloat_      = parseInt(pagesFloat_a[0])

      if(pagesFloat_a[1] && pagesFloat_a[1] >= 1) {

        pages = pagesFloat_;
          
      }
      else {

        pages =   pagesFloat                          

      }

      return {
        musicCategorysSearch,
        total: countmusicCategorysSearch,
        page,
        limit,
        pages
      }

    } catch (error) {
        
      return json({ error });

    }
  
  },


}