USE centcom;

DELETE FROM user_permissions WHERE user_id = $1;

INSERT INTO user_permissions (user_id, permission_id) VALUES $2;