create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);


CREATE TABLE gallery (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         title TEXT NOT NULL,
                         description TEXT,
                         image_path TEXT,
                         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);