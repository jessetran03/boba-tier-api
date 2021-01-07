const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db
      .from('bobatier_comments AS c')
      .select('c.id', 'c.text', 'c.date_created', 'c.shop_id',
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', u.id,
              'user_name', u.user_name,
              'first_name', u.first_name,
              'last_name', u.last_name,
              'date_created', u.date_created,
              'date_modified', u.date_modified
            )
          ) AS "user"`
        )
      )
      .leftJoin(
        'bobatier_users AS u',
        'c.user_id',
        'u.id',
      )
      .where('c.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('bobatier_comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
      )
  },

  serializeComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      text: xss(comment.text),
      shop_id: comment.shop_id,
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  }
}

module.exports = CommentsService
