import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, signOut } from "@/services/authService";
import { Users, MessageSquare, Calendar, Briefcase, Settings, LogOut, User } from "lucide-react";

export function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="hidden sm:inline font-heading font-bold text-lg">Mezunlar Derneği</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/directory" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mezunlar
            </Link>
            <Link href="/messages" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mesajlar
            </Link>
            <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Etkinlikler
            </Link>
            <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              İş İlanları
            </Link>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.full_name || "Kullanıcı"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}