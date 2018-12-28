--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
INSERT INTO users (name, reputation, created_at) VALUES
  ('Bethany Eanes', 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days')),
  ('Tracy DiNunzio', 5, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days')),
  ('Vera Churilov', 3, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days')),
  ('Grace Flowers', 8, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days')),
  ('Nicolle French', 7, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days')),
  ('James McWhinney', 3, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days')),
  ('Evan Bloom', 4, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days'));

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DELETE FROM users;
