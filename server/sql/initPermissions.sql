DELETE FROM permissions WHERE 1=1;

INSERT INTO permissions (key, description)
VALUES
    ('VIEW_USERS', 'View User List'),
    ('EDIT_USERS', 'Edit Users'),
    ('DELETE_USERS', 'Delete Users'),
    ('VIEW_BANS', 'View Ban List'),
    ('EDIT_BANS', 'Edit Bans'),
    ('REMOVE_BAN', 'Remove Ban (from anybody)');
