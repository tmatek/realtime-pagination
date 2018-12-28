--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE users (
  id integer primary key,
  name text not null,
  reputation integer not null,
  created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  deleted_at text default null
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE users;
