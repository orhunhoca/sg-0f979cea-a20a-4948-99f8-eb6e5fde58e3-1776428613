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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { authService } from "@/services/authService";
import { notificationService } from "@/services/notificationService";
import { Bell, LogOut, User, Menu, X, ChevronDown, Instagram, Twitter, Linkedin, MessageCircle, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      
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

  const aboutItems = [
    { href: "/about", label: "Başkanın Mesajı & Yönetim Kurulu" },
  ];

  const membershipItems = [
    { href: "http://eymeder.com/neden-uye-olmaliyim", label: "Neden Üye Olmalıyım?", external: true },
    { href: "https://fonzip.com/eymeder/form/uyelik-basvuru-formu", label: "Üyelik Başvuru", external: true },
    { href: "https://fonzip.com/eymeder/odeme", label: "Aidat Öde", external: true },
    { href: "https://fonzip.com/eymeder/bagis-yap", label: "Bağış Yap", external: true },
  ];

  return (
    <nav className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo - Left Side */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <img 
            src="/logo.jpg" 
            alt="Eyüboğlu Mezunlar Derneği" 
            className="h-14 w-auto"
            onError={(e) => {
              console.error("Logo yüklenemedi");
              e.currentTarget.style.display = "none";
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Ana Sayfa
          </Link>
          
          {/* Hakkımızda Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                Hakkımızda
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/about/baskanin-mesaji" className="cursor-pointer">
                  Başkanın Mesajı
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about/yonetim-kurulu" className="cursor-pointer">
                  Yönetim Kurulu
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/directory" className="text-sm font-medium hover:text-primary transition-colors">
            Üyeler
          </Link>
          <Link href="/brands" className="text-sm font-medium hover:text-primary transition-colors">
            İndirimli Markalar
          </Link>
          <NavigationMenuLink
            href="/events"
            className={cn(
              "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
              "text-base",
              router.pathname === "/events" && "bg-accent text-accent-foreground"
            )}
          >
            Etkinlikler
          </NavigationMenuLink>
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
          
          {/* Üyelik Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors outline-none">
              Üyelik
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {membershipItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  {item.external ? (
                    <a 
                      href={item.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <>
              <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors hidden lg:block">
                Admin
              </Link>
            </>
          )}

          {/* Language Selector */}
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {user && (
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
          )}

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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-card">
          <div className="container py-4 space-y-3">
            <Link 
              href="/" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            
            <div className="space-y-1">
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground">Hakkımızda</div>
              <Link 
                href="/about/baskanin-mesaji" 
                className="block px-8 py-2 hover:bg-muted rounded-md transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Başkanın Mesajı
              </Link>
              <Link 
                href="/about/yonetim-kurulu" 
                className="block px-8 py-2 hover:bg-muted rounded-md transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Yönetim Kurulu
              </Link>
            </div>

            <Link 
              href="/directory" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Üyeler
            </Link>
            <Link 
              href="/brands" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              İndirimli Markalar
            </Link>
            <Link 
              href="/events" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Etkinlikler
            </Link>
            <Link 
              href="/jobs" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              İş İlanları
            </Link>
            <Link 
              href="/gallery" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Galeri
            </Link>
            <Link 
              href="/news" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Haberler
            </Link>
            <Link 
              href="/testimonials" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Başarılı Mezunlar
            </Link>
            <Link 
              href="/groups" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gruplar
            </Link>
            <Link 
              href="/mentorship" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mentorluk
            </Link>
            <Link 
              href="/messages" 
              className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mesajlar
            </Link>

            <div className="space-y-1">
              <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">Üyelik</div>
              {membershipItems.map((item) => (
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block pl-8 pr-4 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block pl-8 pr-4 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            <div className="space-y-1">
              <Link 
                href="/admin" 
                className="block px-4 py-2 hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>

            {/* Mobile Auth Section */}
          </div>
        </div>
      )}
    </nav>
  );
}