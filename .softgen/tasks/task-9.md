---
title: News Feed & Community Interactions
status: todo
priority: medium
type: feature
tags: [feed, posts, social]
created_by: agent
created_at: 2026-04-11T18:14:44Z
position: 9
---

## Notes
Sosyal feed - duyurular, üye paylaşımları, etkileşim (beğeni, yorum).

Requirements:
- Ana sayfa feed'i (duyurular + üye postları)
- Post oluşturma (metin, fotoğraf, link)
- Beğeni ve yorum sistemi
- Admin duyuruları (pinned posts)
- Bildirimler (yeni yorum, beğeni)

## Checklist
- [ ] Create posts table with text, images, author
- [ ] Create post_likes and post_comments tables
- [ ] Create PostService with create, like, comment methods
- [ ] Update index.tsx with news feed component
- [ ] Create post composer (create new post)
- [ ] Add like and comment interactions
- [ ] Add admin announcement capability