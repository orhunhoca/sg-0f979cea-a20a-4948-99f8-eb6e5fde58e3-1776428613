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
import { profileService, type ProfileUpdate } from "@/services/profileService";
import { gamificationService } from "@/services/gamificationService";
import { Loader2, Upload, Save, User, Briefcase, MapPin, GraduationCap, Trophy, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [formData, setFormData] = useState<ProfileUpdate>({
    full_name: "",
    phone: "",
    graduation_year: undefined,
    department: "",
    profession: "",
    company: "",
    city: "",
    bio: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    setUser(currentUser);

    const [profileResult, statsResult] = await Promise.all([
      profileService.getMyProfile(),
      gamificationService.getUserStats(),
    ]);

    if (profileResult.data) {
      setFormData({
        full_name: profileResult.data.full_name || "",
        phone: profileResult.data.phone || "",
        graduation_year: profileResult.data.graduation_year || undefined,
        department: profileResult.data.department || "",
        profession: profileResult.data.profession || "",
        company: profileResult.data.company || "",
        city: profileResult.data.city || "",
        bio: profileResult.data.bio || "",
      });
    }

    if (statsResult.data) {
      setUserStats(statsResult.data);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await profileService.updateMyProfile(formData);
    
    if (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } else {
      // Award points for profile update
      await gamificationService.awardPoints("profile_update", 10);
      
      toast({
        title: "Başarılı",
        description: "Profiliniz güncellendi.",
      });
      setEditing(false);
      loadProfile();
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { error } = await profileService.uploadAvatar(file);
    
    if (error) {
      toast({
        title: "Hata",
        description: "Profil fotoğrafı yüklenemedi.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Başarılı",
        description: "Profil fotoğrafınız güncellendi.",
      });
      loadProfile();
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
        title="Profilim - Mezunlar Derneği"
        description="Profil bilgilerinizi görüntüleyin ve güncelleyin"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-heading font-bold">Profilim</h1>
              {!editing && (
                <Button onClick={() => setEditing(true)}>
                  Profili Düzenle
                </Button>
              )}
            </div>

            {/* Gamification Stats */}
            {userStats && (
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Trophy className="h-6 w-6 text-accent" />
                      </div>
                      <div className="text-2xl font-heading font-bold text-primary">
                        {userStats.totalPoints}
                      </div>
                      <div className="text-sm text-muted-foreground">Toplam Puan</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Award className="h-6 w-6 text-accent" />
                      </div>
                      <div className="text-2xl font-heading font-bold text-primary">
                        {userStats.earnedBadges.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Rozet</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="text-2xl font-heading font-bold text-primary">
                        Seviye {userStats.level}
                      </div>
                      <div className="text-sm text-muted-foreground">Seviye</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="text-2xl font-heading font-bold text-primary">
                        {userStats.rank}
                      </div>
                      <div className="text-sm text-muted-foreground">Rütbe</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Earned Badges */}
            {userStats && userStats.earnedBadges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Kazanılan Rozetler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {userStats.earnedBadges.map((badge: any) => (
                      <Badge key={badge.id} variant="secondary" className="text-sm py-2 px-3">
                        <span className="mr-2">{badge.icon}</span>
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {formData.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {editing && (
                      <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                          <Upload className="h-4 w-4" />
                        </div>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </Label>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{formData.full_name}</CardTitle>
                    <CardDescription>{user?.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">
                      <User className="h-4 w-4 inline mr-2" />
                      Ad Soyad
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduation_year">Mezuniyet Yılı</Label>
                    <Select
                      value={formData.graduation_year?.toString() || ""}
                      onValueChange={(value) => setFormData({ ...formData, graduation_year: parseInt(value) || undefined })}
                    >
                      <SelectTrigger id="graduation_year">
                        <SelectValue placeholder="Yıl seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(
                          (year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Bölüm</Label>
                    <Input
                      id="department"
                      placeholder="Örn: Bilgisayar Mühendisliği"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Meslek</Label>
                    <Input
                      id="profession"
                      placeholder="Örn: Yazılım Geliştirici"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Şirket (Opsiyonel)</Label>
                    <Input
                      id="company"
                      placeholder="Örn: ABC Teknoloji"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                      id="city"
                      placeholder="Örn: İstanbul"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Hakkımda</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!editing}
                    rows={4}
                    placeholder="Kendinizi tanıtın..."
                  />
                </div>

                {editing && (
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => {
                      setEditing(false);
                      loadProfile();
                    }}>
                      İptal
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Kaydet
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}