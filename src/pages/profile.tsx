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
import { authService } from "@/services/authService";
import { profileService, type ProfileUpdate } from "@/services/profileService";
import { Loader2, Upload, Save, User, Briefcase, MapPin, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
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

    const { data: profile } = await profileService.getMyProfile();
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        graduation_year: profile.graduation_year || undefined,
        department: profile.department || "",
        profession: profile.profession || "",
        company: profile.company || "",
        city: profile.city || "",
        bio: profile.bio || "",
      });
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
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-heading font-bold">Profilim</h1>
              {!editing && (
                <Button onClick={() => setEditing(true)}>
                  Profili Düzenle
                </Button>
              )}
            </div>

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
                    <Label htmlFor="graduation_year">
                      <GraduationCap className="h-4 w-4 inline mr-2" />
                      Mezuniyet Yılı
                    </Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      value={formData.graduation_year || ""}
                      onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) || undefined })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Bölüm</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">
                      <Briefcase className="h-4 w-4 inline mr-2" />
                      Meslek
                    </Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Şirket</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Şehir
                    </Label>
                    <Input
                      id="city"
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