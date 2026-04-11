import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { gamificationService } from "@/services/gamificationService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trophy, Star, Award } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [gamification, setGamification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [department, setDepartment] = useState("");
  const [profession, setProfession] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
    } else {
      setUser(currentUser);
      await loadProfile(currentUser.id);
      await loadGamification(currentUser.id);
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await profileService.getMyProfile();
    if (!error && data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setBio(data.bio || "");
      setGraduationYear(data.graduation_year?.toString() || "");
      setDepartment(data.department || "");
      setProfession(data.profession || "");
      setCompany(data.company || "");
      setCity(data.city || "");
      setPhone(data.phone || "");
      setLinkedinUrl(data.linkedin_url || "");
    }
  };

  const loadGamification = async (userId: string) => {
    const data = await gamificationService.getUserStats(userId);
    if (data) {
      setGamification(data);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const updates = {
      full_name: fullName,
      bio,
      graduation_year: graduationYear ? parseInt(graduationYear) : null,
      department,
      profession,
      company,
      city,
      phone,
      linkedin_url: linkedinUrl,
    };

    const { error } = await profileService.updateMyProfile(updates);

    if (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenemedi",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Başarılı",
        description: "Profiliniz güncellendi",
      });
      await loadProfile(user.id);
    }

    setSaving(false);
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
        title="Profilim - Mezunlar Derneği"
        description="Profil bilgilerinizi düzenleyin"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with Avatar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {fullName ? fullName[0].toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h1 className="text-2xl font-heading font-bold">{fullName || "İsimsiz Kullanıcı"}</h1>
                      <p className="text-muted-foreground">{profession || "Meslek belirtilmemiş"}</p>
                      {company && <p className="text-sm text-muted-foreground">{company}</p>}
                    </div>

                    {gamification && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium">{gamification.points} Puan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Seviye {gamification.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium">{gamification.badges?.length || 0} Rozet</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Fotoğraf Yükle
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            {gamification?.badges && gamification.badges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Rozetlerim
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {gamification.badges.map((badge: any, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Edit Form */}
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>
                  Bilgilerinizi güncelleyerek diğer mezunların sizi bulmasını kolaylaştırın
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Ad Soyad *</Label>
                    <Input
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+90 555 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea
                    id="bio"
                    placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="graduation_year">Mezuniyet Yılı</Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      placeholder="Örn: 2020"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Bölüm</Label>
                    <Input
                      id="department"
                      placeholder="Örn: Bilgisayar Mühendisliği"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Meslek</Label>
                    <Input
                      id="profession"
                      placeholder="Örn: Yazılım Geliştirici"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Şirket</Label>
                    <Input
                      id="company"
                      placeholder="Örn: ABC Teknoloji"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                      id="city"
                      placeholder="Örn: İstanbul"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profili</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => router.push("/")}>
                    İptal
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}