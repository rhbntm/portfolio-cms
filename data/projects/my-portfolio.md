---
id: 3
title: "My portfolio"
slug: "my-portfolio"
summary: "My portfolio and its custom CMS: an admin panel for posts and projects, backed by Supabase with a daily GitHub mirror as a fallback."
tech_stack:
  - "React 19"
  - "Vite"
  - "Supabase"
  - "GitHub Actions"
  - "Vercel"
image_url: "https://raw.githubusercontent.com/rhbntm/portfolio-cms/main/data/images/projects/1793425490222-portfolio-cover.png"
github_url: "https://github.com/rhbntm/portfolio-cms"
live_url: null
sort_order: 3
created_at: "2026-04-23T10:41:13.090681+00:00"
updated_at: "2026-04-23T10:41:13.090681+00:00"
---

This site is my portfolio and the custom CMS behind it. I manage posts and projects from a protected admin panel instead of editing code.

### Key Features

* Markdown editor with live preview, drafts, and drag-and-drop image uploads with compression.
* Supabase for the database, authentication, and image storage.
* A daily GitHub Actions job that mirrors published content and images to the repository.
* An automatic fallback to that mirror, so public pages stay readable if Supabase is unavailable.
