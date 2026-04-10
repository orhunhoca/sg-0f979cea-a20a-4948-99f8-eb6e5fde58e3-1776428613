---
title: Design System & Authentication Setup
status: in_progress
priority: urgent
type: feature
tags: [design, auth, foundation]
created_by: agent
created_at: 2026-04-10T21:57:12Z
position: 1
---

## Notes
Core design system kurulumu ve authentication altyapısı. Supabase ile mail + membership number tabanlı giriş sistemi. Excel import için membership_numbers tablosu hazırlığı.

## Checklist
- [x] globals.css: kurumsal mavi + turuncu accent renkleri, Plus Jakarta Sans + Work Sans fontlar
- [x] tailwind.config.ts: custom color tokens kayıt
- [ ] Supabase auth setup: profiles tablosu + RLS (T1 - private user data)
- [ ] membership_numbers tablosu: number, email, name, is_used, created_at
- [ ] Login sayfası: mail + 8 haneli numara formu, validation
- [ ] Signup sayfası: membership number ile otomatik eşleştirme
- [ ] AuthService: login, signup, session management