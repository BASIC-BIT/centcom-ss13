DELETE FROM users WHERE 1=1;
DELETE FROM permissions WHERE 1=1;
DELETE FROM user_permissions WHERE 1=1;
DELETE FROM user_groups WHERE 1=1;
DELETE FROM user_group_members WHERE 1=1;
DELETE FROM user_group_permissions WHERE 1=1;

INSERT INTO permissions (id, name, description)
VALUES
    (1, 'VIEW_USERS', 'View User List'),
    (2, 'EDIT_USERS', 'Edit Users'),
    (3, 'DELETE_USERS', 'Delete Users'),
    (4, 'VIEW_BANS', 'View Ban List'),
    (5, 'EDIT_BANS', 'Edit Bans'),
    (6, 'REMOVE_BAN', 'Remove Ban (from anybody)'),
    (7, 'ALL', 'Override for All Permissions');

INSERT INTO
    users (id, nickname, email, byond_key)
VALUES
    (1, 'Steven', 'abc@def.com', NULL),
    (2, 'Keekenox', 'anemail@example.com', NULL),
    (3, 'Xantam', NULL, NULL);

INSERT INTO
    user_permissions (permission_id, user_id)
VALUES
    (1, 1);