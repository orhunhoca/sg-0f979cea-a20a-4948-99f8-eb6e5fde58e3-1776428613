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
import { authService } from "@/services/authService";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, MessageSquare, Calendar, Briefcase, Settings, LogOut, User, Globe } from "lucide-react";

export function Navigation() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/auth/login");
  };

  const toggleLanguage = () => {
    setLanguage(language === "tr" ? "en" : "tr");
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-heading font-bold text-primary">
            Mezunlar
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/directory" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.directory")}
            </Link>
            <Link href="/messages" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.messages")}
            </Link>
            <Link href="/fonzip-events" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.events")}
            </Link>
            <Link href="/fonzip-signup" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.membership")}
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.admin")}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language.toUpperCase()}
          </Button>

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
                {t("nav.profile")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t("nav.signout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}