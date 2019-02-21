DELETE FROM config WHERE 1=1;

INSERT INTO
    config (cfg_key, cfg_value)
VALUES
    ('community_name', 'Yogstation'),
    ('forums_url', 'https://forums.yogstation.net/index.php'),
    ('github_url', 'https://github.com/yogstation13/yogstation'),
    ('wiki_url', 'https://wiki.yogstation.net/'),
    ('footer_text', 'CentCom - SS13 Management Platform'),
    ('panel_header_text', 'YogStation13'),
    ('splash_title_text', 'YogStation13')
    ('twitter_url', 'https://twitter.com/Yogstation_13'),
    ('steam_url', 'https://steamcommunity.com/groups/yogstation13'),
    ('donate_url', 'https://www.yogstation.net/index.php?do=donate');