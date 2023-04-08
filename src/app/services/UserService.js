const User      = require('../models/User');

module.exports = {

  async get(
    filter,
    sort,
    page, 
    limit,
    pages
  ) {

    // try {
      
      const countSearch = await User
      .find(filter)
      .skip(Number(page) * Number(limit))
      .limit(Number(limit))
      .sort(sort)
      .populate('musicCategory')
      .collation({
        locale : "pt"
      })
      
      const countCount = await User
      .find(filter)

      const countcountSearch = await countCount.length;

      const pagesFloat = (Number(countcountSearch)/limit);
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
        countSearch,
        total: countcountSearch,
        page,
        limit,
        pages
      }

    // } catch (error) {
        
    //   return json({ error });

    // }
  
  },


}