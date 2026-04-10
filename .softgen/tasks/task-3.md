---
title: Real-time Messaging & Connections
status: todo
priority: high
type: feature
tags: [messaging, realtime]
created_by: agent
created_at: 2026-04-10T21:57:12Z
position: 3
---

## Notes
Gerçek zamanlı mesajlaşma sistemi. Supabase Realtime kullanarak birebir sohbet. Bağlantı istekleri (LinkedIn-style).

## Checklist
- [ ] messages tablosu: sender_id, receiver_id, content, created_at, read
- [ ] connections tablosu: requester_id, receiver_id, status (pending/accepted)
- [ ] MessagesPage.tsx: sohbet listesi + aktif sohbet görünümü
- [ ] Realtime subscription setup: yeni mesajları canlı göster
- [ ] Connection requests: gönder, kabul et, reddet
- [ ] messageService.ts: send, fetch, markAsRead