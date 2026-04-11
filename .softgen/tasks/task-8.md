---
title: Job Board & Referral System
status: in_progress
priority: high
type: feature
tags: [jobs, career, referrals]
created_by: agent
created_at: 2026-04-11T18:14:44Z
position: 8
---

## Notes
İş ilanları ve referans sistemi - üyeler iş ilanı paylaşabilir, başvuru yapabilir, referans verebilir.

Requirements:
- İş ilanı oluşturma (başlık, şirket, konum, açıklama, gereksinimler)
- İş listesi (filtreleme: şehir, sektör, deneyim seviyesi)
- Başvuru sistemi (CV yükleme veya profil gönderme)
- Referans sistemi (üyeler birbirini referans edebilir)
- İlan sahibi başvuruları görebilir

## Checklist
- [ ] Create jobs table with company, location, requirements
- [ ] Create job_applications table for tracking
- [ ] Create JobService with post, apply, referral methods
- [ ] Create /jobs page with job listings and filters
- [ ] Create /jobs/create page for posting jobs
- [ ] Create /jobs/[id] detail page with apply button
- [ ] Add referral modal for recommending candidates