const DrinksService = {
  getAllDrinks(knex) {
    return knex.select('*').from('bobatier_drinks')
  },
  getByShop(knex, shop_id) {
    return knex
      .select('*').from('bobatier_drinks')
      .where({ shop_id })
  },
  getDrinksWithRatings(knex, shop_id, user_id) {
    return knex
      .select('d.id', 'd.drink_name', 'd.shop_id', 'r.id as rating_id', 'r.user_id', 'r.rating')
      .from('bobatier_drinks as d')
      .leftJoin('bobatier_ratings as r', function () {
        this
          .on('d.id', 'r.drink_id')
          .on('r.user_id', user_id)
      })
      .where({ shop_id })
  },
  getUserDrinksWithRatings(knex, shop_id, user_id) {
    return knex
      .select('d.id', 'd.drink_name', 'd.shop_id', 'r.id as rating_id', 'r.user_id', 'r.rating')
      .from('bobatier_drinks as d')
      .join('bobatier_ratings as r', function () {
        this
          .on('d.id', 'r.drink_id')
          .on('r.user_id', user_id)
      })
      .modify(function(filter) {
        if (shop_id !== 'all') {
          filter.where({ shop_id })
        }
      })
  },
  insertDrink(knex, newDrink) {
    return knex
      .insert(newDrink)
      .into('bobatier_drinks')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('bobatier_drinks').select('*').where('id', id).first()
  },
  deleteDrink(knex, id) {
    return knex('bobatier_drinks')
      .where({ id })
      .delete()
  },
  updateDrink(knex, id, newDrinkFields) {
    return knex('bobatier_drinks')
      .where({ id })
      .update(newDrinkFields)
  },
}

module.exports = DrinksService