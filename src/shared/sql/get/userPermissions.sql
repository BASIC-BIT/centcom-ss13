SELECT
    user_permissions.id AS id,
    user_permissions.user_id AS user_id,
    user_permissions.permission_id AS permission_id,
    permissions.name AS name,
    permissions.description AS description
FROM user_permissions
LEFT JOIN permissions
    ON user_permissions.permission_id = permissions.id
LEFT JOIN users
    ON user_permissions.user_id = users.id;