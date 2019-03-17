SELECT
    user_group_members.id AS id,
    user_group_members.user_id AS user_id,
    user_group_members.group_id AS group_id,
    user_groups.name AS name,
    user_groups.description AS description
FROM user_group_members
LEFT JOIN user_groups
    ON user_group_members.group_id = user_groups.id
LEFT JOIN users
    ON user_group_members.user_id = users.id;