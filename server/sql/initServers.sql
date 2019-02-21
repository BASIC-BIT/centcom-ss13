DELETE FROM servers WHERE 1=1;

INSERT INTO
    servers (name, url, access_level)
VALUES
    ('Main', 'byond://game.yogstation.net:4133', 'ALL'),
    ('Test', 'byond://whatever', 'ADMIN');