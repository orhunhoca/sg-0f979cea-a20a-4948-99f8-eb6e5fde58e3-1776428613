import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { authService } from "@/services/authService";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Image as ImageIcon, 
  Newspaper, 
  Star, 
  UserPlus, 
  MessageSquare,
  UsersRound,
  Award,
  Tag
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await authService.getCurrentUser();
    if (!user) {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "Üyeler",
      description: "Mezun arkadaşlarınızı bulun",
      icon: Users,
      href: "/directory",
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-600",
    },
    {
      title: "Etkinlikler",
      description: "Yaklaşan etkinlikler",
      icon: Calendar,
      href: "https://fonzip.com/eymeder/etkinlikler",
      external: true,
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-600",
    },
    {
      title: "İş İlanları",
      description: "Kariyer fırsatları",
      icon: Briefcase,
      href: "/jobs",
      color: "from-green-500 to-green-600",
      iconColor: "text-green-600",
    },
    {
      title: "Galeri",
      description: "Fotoğraf ve videolar",
      icon: ImageIcon,
      href: "/gallery",
      color: "from-pink-500 to-pink-600",
      iconColor: "text-pink-600",
    },
    {
      title: "Haberler",
      description: "Güncel haberler",
      icon: Newspaper,
      href: "/news",
      color: "from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
    },
    {
      title: "Başarılı Mezunlar",
      description: "İlham verici hikayeler",
      icon: Star,
      href: "/testimonials",
      color: "from-yellow-500 to-yellow-600",
      iconColor: "text-yellow-600",
    },
    {
      title: "Gruplar",
      description: "İlgi alanı grupları",
      icon: UsersRound,
      href: "/groups",
      color: "from-indigo-500 to-indigo-600",
      iconColor: "text-indigo-600",
    },
    {
      title: "Mentorluk",
      description: "Mentor bulun",
      icon: Award,
      href: "/mentorship",
      color: "from-teal-500 to-teal-600",
      iconColor: "text-teal-600",
    },
    {
      title: "Mesajlar",
      description: "Sohbet edin",
      icon: MessageSquare,
      href: "/messages",
      color: "from-red-500 to-red-600",
      iconColor: "text-red-600",
    },
    {
      title: "Üyelik",
      description: "Derneğe üye olun",
      icon: UserPlus,
      href: "/fonzip-signup",
      gradient: "from-cyan-500 to-cyan-600",
      iconBg: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    },
    {
      title: "İndirimli Markalar",
      description: "Anlaşmalı markalardan indirim",
      icon: Tag,
      href: "/brands",
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
  ];

  return (
    <>
      <Head>
        <SEO 
          title="Ana Sayfa - Eyüboğlu Mezunlar Derneği"
          description="Eyüboğlu Eğitim Kurumları Mezunlar Derneği - Mezunlar arasında güçlü bir profesyonel ve sosyal bağlantı ağı"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navigation />
        <main className="container py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hoş Geldiniz
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Eyüboğlu Eğitim Kurumları Mezunlar Derneği
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>

          {/* Modern Grid Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const CardComponent = (
                <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0">
                  <CardContent className="p-0">
                    <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                    <div className="p-6 space-y-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className={`h-0.5 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                    </div>
                  </CardContent>
                </Card>
              );

              if (item.external) {
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {CardComponent}
                  </a>
                );
              }

              return (
                <Link key={item.title} href={item.href}>
                  {CardComponent}
                </Link>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">Büyük Eyüboğlu Ailesine Hoş Geldiniz!</h2>
                <p className="text-muted-foreground">
                  Mezun arkadaşlarınızla bağlantıda kalın, etkinliklere katılın ve kariyer fırsatları keşfedin.
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Link 
                    href="/directory"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Users className="h-5 w-5" />
                    Mezunları Keşfet
                  </Link>
                  <Link 
                    href="/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent to-accent/80 text-white font-medium hover:shadow-lg transition-all hover:scale-105"
                  >
                    <UserPlus className="h-5 w-5" />
                    Profilini Tamamla
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}