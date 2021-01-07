const xss = require('xss')

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
  getCommentsForShop(db, shop_id) {
    return db
      .from('bobatier_comments AS c')
      .select('c.id', 'c.text', 'c.date_created',
        db.raw(
          `json_strip_nulls(
          row_to_json(
            (SELECT tmp FROM (
              SELECT
                u.id,
                u.user_name,
                u.first_name,
                u.last_name,
                u.date_created,
                u.date_modified
            ) tmp)
          )
        ) AS "user"`
        )
      )
      .where('c.shop_id', shop_id)
      .leftJoin(
        'bobatier_users AS u',
        'c.user_id',
        'u.id',
      )
      .groupBy('c.id', 'u.id')
  },

  serializeShopComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      article_id: comment.article_id,
      text: xss(comment.text),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        first_name: user.full_name,
        last_name: user.last_name,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      }
    }
  }
}

module.exports = ShopsService