DELETE FROM config WHERE 1=1;

INSERT INTO
    config (cfg_key, cfg_value)
VALUES
    ('community_name', 'Yogstation'),
    ('forums_url', 'https://forums.yogstation.net/index.php'),
    ('github_url', 'https://github.com/yogstation13/yogstation'),
    ('wiki_url', 'https://wiki.yogstation.net/'),
    ('footer_text', 'CentCom - SS13 Management Platform - ');