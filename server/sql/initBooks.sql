DELETE FROM books WHERE 1=1;
DELETE FROM book_categories WHERE 1=1;

INSERT INTO book_categories (id, name)
VALUES
    (100, 'Reference'),
    (101, 'Fiction'),
    (102, 'History');

INSERT INTO
    books (title, content, category_id)
VALUES
    ('Hello world!', 'This is a book!', 100),
    ('WGW', 'One day...', 101),
    ('Foo', 'Bar', 100),
    ('Baz', 'Quux', 102);
