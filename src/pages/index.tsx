import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { Users, MessageSquare, Trophy, TrendingUp, Calendar, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
    } else {
      setUser(currentUser);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Ana Sayfa - Mezunlar Derneği" 
        description="Mezunlar ağına hoş geldiniz. Bağlantılar kurun, etkinliklere katılın, kariyer fırsatları keşfedin."
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          {/* Welcome Section */}
          <div className="mb-8 bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-white">
            <h1 className="text-4xl font-heading font-bold mb-2">
              Hoş Geldiniz, {user?.full_name}! 👋
            </h1>
            <p className="text-lg opacity-90">
              Mezunlar ağımızda yeni bağlantılar kurun, etkinliklere katılın ve kariyerinizi geliştirin.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Mezun</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">Aktif üye</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bağlantılarım</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">Profesyonel bağlantı</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktivite Puanı</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">250</div>
                <p className="text-xs text-muted-foreground">Bu ay +50</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mesajlar</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Okunmamış mesaj</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Mezunları Keşfet</CardTitle>
                <CardDescription>
                  Bölümünüz, şehriniz veya sektörünüzdeki mezunları bulun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/directory">
                  <Button className="w-full">Mezun Dizini</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Yaklaşan Etkinlikler</CardTitle>
                <CardDescription>
                  Buluşma, seminer ve webinarlara katılın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/events">
                  <Button variant="outline" className="w-full">Etkinlikler</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Briefcase className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Kariyer Fırsatları</CardTitle>
                <CardDescription>
                  İş ilanları, mentörlük ve referans fırsatları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/jobs">
                  <Button variant="outline" className="w-full">İş İlanları</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>Ağınızdaki son gelişmeler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">3 yeni bağlantı isteği</p>
                    <p className="text-xs text-muted-foreground">2 saat önce</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Yeni etkinlik: "Kariyer Zirvesi 2026"</p>
                    <p className="text-xs text-muted-foreground">1 gün önce</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Yeni rozet kazandınız: "Aktif Üye"</p>
                    <p className="text-xs text-muted-foreground">3 gün önce</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}