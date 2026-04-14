import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authService } from "@/services/authService";
import { notificationService } from "@/services/notificationService";
import { Bell, LogOut, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      
      // Subscribe to realtime notifications
      const channel = notificationService.subscribeToNotifications(user.id, (payload) => {
        setNotifications((prev) => [payload.new, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user]);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const loadNotifications = async () => {
    const { data } = await notificationService.getMyNotifications();
    if (data) setNotifications(data);
  };

  const loadUnreadCount = async () => {
    const { count } = await notificationService.getUnreadCount();
    setUnreadCount(count);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/auth/login");
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await notificationService.markAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    }
    if (notification.link) {
      router.push(notification.link);
      setNotifOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.jpg" 
              alt="Eyüboğlu Eğitim Kurumları Mezunlar Derneği" 
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/directory" className="text-sm font-medium hover:text-primary transition-colors">
              Üyeler
            </Link>
            <a 
              href="https://fonzip.com/eymeder/etkinlikler" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Etkinlikler
            </a>
            <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
              İş İlanları
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors">
              Galeri
            </Link>
            <Link href="/news" className="text-sm font-medium hover:text-primary transition-colors">
              Haberler
            </Link>
            <Link href="/testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Başarılı Mezunlar
            </Link>
            <Link href="/groups" className="text-sm font-medium hover:text-primary transition-colors">
              Gruplar
            </Link>
            <Link href="/mentorship" className="text-sm font-medium hover:text-primary transition-colors">
              Mentorluk
            </Link>
            <Link href="/messages" className="text-sm font-medium hover:text-primary transition-colors">
              Mesajlar
            </Link>
            <Link href="/fonzip-signup" className="text-sm font-medium hover:text-primary transition-colors">
              Üyelik
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Bildirimler</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                    Tümünü Okundu İşaretle
                  </Button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Henüz bildiriminiz yok
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notif.is_read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notif.created_at), { 
                              addSuffix: true,
                              locale: tr 
                            })}
                          </p>
                        </div>
                        {!notif.is_read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profilim
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}