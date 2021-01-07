const ShopsService = {
  getAllShops(knex) {
    return knex
      .select('*').from('bobatier_shops')
  },
  insertShop(knex, newShop) {
    return knex
      .insert(newShop)
      .into('bobatier_shops')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('bobatier_shops').select('*').where('id', id).first()
  },
  deleteShop(knex, id) {
    return knex('bobatier_shops')
      .where({ id })
      .delete()
  },
  updateShop(knex, id, newShopFields) {
    return knex('bobatier_shops')
      .where({ id })
      .update(newShopFields)
  },
}

module.exports = ShopsService