DELETE FROM config WHERE 1=1;

INSERT INTO
    servers (name, url, description, access_level)
VALUES
    ('Yogstation', 'byond://game.yogstation.net:4133', 'It''s the server!', 'ALL'),
    ('Test Server', 'byond://whatever', 'Testing and stuff', 'ADMIN');