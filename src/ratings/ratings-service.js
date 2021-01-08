const RatingsService = {
  getAllRatings(knex) {
    return knex.select('*').from('bobatier_ratings')
  },
  getRatingsByDrinks(knex) {
    return knex
      .select('r.drink_id', 'd.drink_name', 's.shop_name')
      .count('r.rating as count')
      .avg('r.rating as average')
      .from('bobatier_ratings as r')
      .join('bobatier_drinks as d', 'r.drink_id', 'd.id')
      .join('bobatier_shops as s', 'd.shop_id', 's.id')
      .groupBy('r.drink_id', 'd.drink_name', 's.shop_name')
      .orderBy('average', 'desc')
      .orderBy('count', 'desc')
  },
  getDrinkRatingsByShop(knex, shop_id) {
    return knex
    .select('r.drink_id', 'd.drink_name', 's.shop_name')
    .count('r.rating as count')
    .avg('r.rating as average')
    .from('bobatier_ratings as r')
    .join('bobatier_drinks as d', 'r.drink_id', 'd.id')
    .join('bobatier_shops as s', 'd.shop_id', 's.id')
    .where( 's.id', shop_id)
    .groupBy('r.drink_id', 'd.drink_name', 's.shop_name')
    .orderBy('average', 'desc')
    .orderBy('count', 'desc')
  },
  insertRating(knex, newRating) {
    return knex
      .insert(newRating)
      .into('bobatier_ratings')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('bobatier_ratings').select('*').where('id', id).first()
  },
  deleteRating(knex, id) {
    return knex('bobatier_ratings')
      .where({ id })
      .delete()
  },
  updateRating(knex, id, newRating) {
    return knex('bobatier_ratings')
      .where({ id })
      .update({ rating: newRating })
  },
}

module.exports = RatingsService