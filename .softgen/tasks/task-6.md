---
title: Admin Panel & Role Management
status: todo
priority: medium
type: feature
tags: [admin, roles]
created_by: agent
created_at: 2026-04-10T21:57:12Z
position: 6
---

## Notes
Admin paneli: kullanıcı yönetimi, rol atama (admin, moderator, member), içerik moderasyonu, üyelik numarası import (Excel).

## Checklist
- [ ] roles tablosu: user_id, role (admin/moderator/member)
- [ ] AdminPanel.tsx: kullanıcı listesi, rol değiştirme
- [ ] Excel import: CSV upload ile membership_numbers tablosuna toplu ekleme
- [ ] User management: ban, unban, delete user
- [ ] Content moderation: mesaj silme, kullanıcı bildirimleri
- [ ] adminService.ts: role management, bulk import