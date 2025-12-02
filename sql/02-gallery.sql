CREATE TABLE gallery (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         title TEXT NOT NULL,
                         description TEXT,
                         image_path TEXT,
                         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);