CREATE TABLE bobatier_ratings (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id INTEGER REFERENCES bobatier_users(id) ON DELETE CASCADE NOT NULL,
  drink_id INTEGER REFERENCES bobatier_drinks(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL
);