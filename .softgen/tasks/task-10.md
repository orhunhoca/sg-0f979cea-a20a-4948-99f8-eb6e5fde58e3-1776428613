---
title: Groups & Forums
status: in_progress
priority: medium
type: feature
tags: [groups, forums, discussions]
created_by: agent
created_at: 2026-04-11T18:14:44Z
position: 10
---

## Notes
Gruplar ve forumlar - şehir, sektör, ilgi alanı bazlı topluluklar.

Requirements:
- Grup oluşturma (isim, açıklama, kategori)
- Grup üyeliği (join/leave)
- Grup içi mesajlaşma/tartışma
- Grup etkinlikleri
- Admin moderasyonu

## Checklist
- [ ] Create groups table with name, category, members
- [ ] Create group_members and group_posts tables
- [ ] Create GroupService with join, post methods
- [ ] Create /groups page with group list
- [ ] Create /groups/[id] page with discussions
- [ ] Add group creation form
- [ ] Enable group-specific posts and events