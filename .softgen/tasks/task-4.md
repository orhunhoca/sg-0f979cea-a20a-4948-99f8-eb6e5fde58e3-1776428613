---
title: Gamification & Activity Points
status: todo
priority: medium
type: feature
tags: [gamification, engagement]
created_by: agent
created_at: 2026-04-10T21:57:12Z
position: 4
---

## Notes
Temel gamification sistemi: activity points, badges, leaderboard. Profil tamamlama, mesaj gönderme, etkinlik katılımı gibi aksiyonlar puan kazandırır.

## Checklist
- [ ] activity_points tablosu: user_id, points, action_type, created_at
- [ ] badges tablosu: user_id, badge_name, earned_at
- [ ] Point kazanma kuralları: profil doldur (+50), ilk mesaj (+20), bağlantı (+10)
- [ ] Leaderboard.tsx: en aktif kullanıcılar
- [ ] Badge kartları: "İlk Bağlantı", "Profil Tamamlandı", "Aktif Üye"
- [ ] gamificationService.ts: awardPoints, checkBadges