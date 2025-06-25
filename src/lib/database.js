import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "database.sqlite");
const db = new Database(dbPath);

// Create posts table
db.exec(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Create pages table
db.exec(`
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT NOT NULL,
  photo TEXT, -- Field to store the photo path
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// --- POSTS FUNCTIONS ---
export function createPost({ title, slug, content, author }) {
  const stmt = db.prepare(`
    INSERT INTO posts (title, slug, content, author)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(title, slug, content, author);
  return { id: result.lastInsertRowid, title, slug, content, author };
}

export function getPostById(id) {
  const stmt = db.prepare("SELECT * FROM posts WHERE id = ?");
  return stmt.get(id);
}

export function getPostBySlug(slug) {
  const stmt = db.prepare("SELECT * FROM posts WHERE slug = ?");
  return stmt.get(slug);
}

export function getAllPosts() {
  const stmt = db.prepare("SELECT * FROM posts ORDER BY created_at DESC");
  return stmt.all();
}

export function updatePost(id, { title, slug, content, author }) {
  const stmt = db.prepare(`
    UPDATE posts
    SET title = ?, slug = ?, content = ?, author = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(title, slug, content, author, id);
}

export function deletePost(id) {
  const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
  stmt.run(id);
}

// --- PAGES FUNCTIONS ---
export function createPage({ title, slug, content, photo }) {
  const stmt = db.prepare(`
    INSERT INTO pages (title, slug, content, photo)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(title, slug, content, photo);
  return { id: result.lastInsertRowid, title, slug, content, photo };
}

export function getPageBySlug(slug) {
  const stmt = db.prepare("SELECT * FROM pages WHERE slug = ?");
  return stmt.get(slug);
}

export function getAllPages() {
  const stmt = db.prepare("SELECT * FROM pages ORDER BY created_at DESC");
  return stmt.all();
}

export function updatePage(slug, { title, content, photo }) {
  const stmt = db.prepare(`
    UPDATE pages
    SET title = ?, content = ?, photo = ?, updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `);
  stmt.run(title, content, photo, slug);
}

export function deletePage(slug) {
  const stmt = db.prepare("DELETE FROM pages WHERE slug = ?");
  stmt.run(slug);
}

// Utility functions for pages table management
// export function deletePagesTable() {
//   db.exec("DROP TABLE IF EXISTS pages;");
// }

// export function recreatePagesTable() {
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS pages (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       slug TEXT UNIQUE,
//       content TEXT NOT NULL,
//       photo TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );
//   `);
// }

export default db;
