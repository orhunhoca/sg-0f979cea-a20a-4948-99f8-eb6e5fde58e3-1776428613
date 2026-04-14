import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Image, 
  Newspaper, 
  Star, 
  UsersRound, 
  Award, 
  MessageSquare, 
  UserPlus, 
  Tag,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    } catch (e) {
      console.error(e);
    }
  };

  const menuItems = [
    {
      title: "Üyeler",
      description: "Mezun arkadaşlarınızı bulun",
      icon: Users,
      href: "/directory",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Etkinlikler",
      description: "Yaklaşan etkinlikler",
      icon: Calendar,
      href: "/events",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "İş İlanları",
      description: "Kariyer fırsatları",
      icon: Briefcase,
      href: "/jobs",
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Galeri",
      description: "Fotoğraf ve videolar",
      icon: Image,
      href: "/gallery",
      gradient: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100 text-pink-600",
    },
    {
      title: "Haberler",
      description: "Güncel haberler",
      icon: Newspaper,
      href: "/news",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      title: "Başarılı Mezunlar",
      description: "İlham verici hikayeler",
      icon: Star,
      href: "/testimonials",
      gradient: "from-yellow-500 to-yellow-600",
      iconBg: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Gruplar",
      description: "İlgi alanı grupları",
      icon: UsersRound,
      href: "/groups",
      gradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Mentorluk",
      description: "Mentor & Mentee eşleştirme",
      icon: Award,
      href: "/mentorship",
      gradient: "from-teal-500 to-teal-600",
      iconBg: "bg-teal-100 text-teal-600",
    },
    {
      title: "Mesajlar",
      description: "Mesajlarınızı görün",
      icon: MessageSquare,
      href: "/messages",
      gradient: "from-red-500 to-red-600",
      iconBg: "bg-red-100 text-red-600",
    },
    {
      title: "Üyelik",
      description: "Derneğe üye olun",
      icon: UserPlus,
      href: "/fonzip-signup",
      gradient: "from-cyan-500 to-cyan-600",
      iconBg: "bg-cyan-100 text-cyan-600",
    },
    {
      title: "İndirimli Markalar",
      description: "Anlaşmalı markalardan indirim",
      icon: Tag,
      href: "/brands",
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
    }
  ];

  if (!mounted) return null;

  return (
    <>
      <Head>
        <SEO title="Eyüboğlu Mezunlar Derneği" />
      </Head>
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1">
          {/* Welcome Section */}
          <div className="container py-12 md:py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Hoş Geldiniz
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Eyüboğlu Eğitim Kurumları Mezunlar Derneği
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-6 rounded-full" />
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link href={item.href} key={item.title}>
                    <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 ring-1 ring-border/50 bg-card cursor-pointer">
                      {/* Top Gradient Line */}
                      <div className={`h-2 w-full bg-gradient-to-r ${item.gradient}`} />
                      
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-4 rounded-2xl ${item.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Animated Line */}
                        <div className={`h-0.5 w-full bg-gradient-to-r ${item.gradient} mt-6 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full`} />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="mt-16">
              <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20 overflow-hidden relative">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
                
                <CardContent className="p-8 md:p-12 text-center relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Mezunlar Ağına Katılın</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
                    Bağlantılarınızı güçlendirin, kariyer fırsatlarını yakalayın ve dernek etkinliklerinden haberdar olun.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" asChild className="rounded-full px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                      <Link href="/directory" className="flex items-center gap-2">
                        Mezunları Keşfet
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="rounded-full px-8 bg-background/50 backdrop-blur-sm border-2 hover:bg-background/80 transition-all hover:-translate-y-0.5">
                      <Link href={user ? "/profile" : "/auth/signup"}>
                        {user ? "Profilini Güncelle" : "Aramıza Katıl"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}