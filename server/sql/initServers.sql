DELETE FROM servers WHERE 1=1;

INSERT INTO
    servers (name, url, port, access_level)
VALUES
    ('Main', 'game.yogstation.net', 4133, 'ALL'),
    ('Test', 'whatever', 1234, 'ADMIN');