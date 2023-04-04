const Music      = require('../models/Music');

module.exports = {

  async get(
    filter,
    sort,
    page, 
    limit,
    pages
  ) {

    try {
      
      const musicsSearch = await Music
      .find(filter)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit))
      .sort(sort)
      .populate('musicCategory')
      .collation({
        locale : "pt"
      })
      
      const musicsCount = await Music
      .find(filter)

      const countmusicsSearch = await musicsCount.length;

      const pagesFloat = (Number(countmusicsSearch)/limit);
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
        musicsSearch,
        total: countmusicsSearch,
        page,
        limit,
        pages
      }

    } catch (error) {
        
      return json({ error });

    }
  
  },


}