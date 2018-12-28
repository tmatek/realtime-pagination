--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE VIEW popular_users_forward AS
SELECT * FROM users ORDER BY reputation DESC, id DESC;

CREATE VIEW popular_users_backward AS
SELECT * FROM users ORDER BY reputation ASC, id ASC;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP VIEW popular_users_forward;
DROP VIEW popular_users_backward;
