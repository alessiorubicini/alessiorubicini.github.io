#!/usr/bin/env node
/**
 * new-post.js — Blog post scaffold script
 * Usage: npm run new-post "My Post Title" "tag1,tag2"
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const args = process.argv.slice(2);
const title = args[0];
const tags = args[1] ? args[1].split(",").map((t) => t.trim()) : [];

if (!title) {
  console.error('Usage: npm run new-post "My Post Title" "tag1,tag2"');
  process.exit(1);
}

// Slugify title
const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/[\s_]+/g, "-")
  .replace(/-+/g, "-");

// Date prefix
const now = new Date();
const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
const filename = `${dateStr}-${slug}.md`;
const postsDir = join(repoRoot, "src", "posts");
const filePath = join(postsDir, filename);

if (existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const tagYaml = tags.length
  ? tags.map((t) => `  - ${t}`).join("\n")
  : "  - swift";

const content = `---
title: "${title}"
date: ${dateStr}
description: "A short description for SEO and the post card."
tags:
${tagYaml}
---

Write your post content here.

## Section Heading

Paragraph text. Code blocks are automatically highlighted by Shiki:

\`\`\`swift
// Your Swift code here
print("Hello, World!")
\`\`\`
`;

mkdirSync(postsDir, { recursive: true });
writeFileSync(filePath, content, "utf-8");

console.log(`\n✅ Post created: src/posts/${filename}`);
console.log(`   Title: ${title}`);
console.log(`   Date:  ${dateStr}`);
if (tags.length) console.log(`   Tags:  ${tags.join(", ")}`);
console.log(`\n   Run 'npm start' to preview at http://localhost:8080/blog/\n`);
