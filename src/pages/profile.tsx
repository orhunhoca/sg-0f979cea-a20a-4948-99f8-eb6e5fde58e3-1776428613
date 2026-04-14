import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Briefcase, GraduationCap, MapPin, Phone, Globe, Linkedin, Twitter, Instagram, Facebook, X } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [highSchoolGraduationYear, setHighSchoolGraduationYear] = useState("");
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");
  const [universityStatus, setUniversityStatus] = useState("");
  const [universityGraduationYear, setUniversityGraduationYear] = useState("");
  const [profession, setProfession] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [mentorBio, setMentorBio] = useState("");
  const [mentorshipAreas, setMentorshipAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
    } else {
      setUser(currentUser);
      await loadProfile(currentUser);
      setLoading(false);
    }
  };

  const loadProfile = async (currentUser: any) => {
    const { data, error } = await profileService.getMyProfile();
    if (!error && data) {
      setFullName(data.full_name || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
      setGraduationYear(data.graduation_year?.toString() || "");
      setHighSchoolGraduationYear(data.high_school_graduation_year?.toString() || "");
      setDepartment(data.department || "");
      setUniversity(data.university || "");
      setUniversityStatus(data.university_status || "");
      setUniversityGraduationYear(data.university_graduation_year?.toString() || "");
      setProfession(data.profession || "");
      setCompany(data.company || "");
      setCountry(data.country || "");
      setCity(data.city || "");
      setPhone(data.phone || "");
      setLinkedinUrl(data.linkedin_url || "");
      setTwitterUrl(data.twitter_url || "");
      setInstagramUrl(data.instagram_url || "");
      setFacebookUrl(data.facebook_url || "");
      setIsMentor(data.is_mentor || false);
      setMentorBio(data.mentor_bio || "");
      setMentorshipAreas(data.mentorship_areas || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await profileService.updateMyProfile({
      full_name: fullName,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      graduation_year: graduationYear ? parseInt(graduationYear) : null,
      high_school_graduation_year: highSchoolGraduationYear ? parseInt(highSchoolGraduationYear) : null,
      department: department || null,
      university: university || null,
      university_status: universityStatus || null,
      university_graduation_year: universityGraduationYear ? parseInt(universityGraduationYear) : null,
      profession: profession || null,
      company: company || null,
      country: country || null,
      city: city || null,
      phone: phone || null,
      linkedin_url: linkedinUrl || null,
      twitter_url: twitterUrl || null,
      instagram_url: instagramUrl || null,
      facebook_url: facebookUrl || null,
      is_mentor: isMentor,
      mentor_bio: isMentor ? mentorBio || null : null,
      mentorship_areas: isMentor && mentorshipAreas.length > 0 ? mentorshipAreas : null,
    });

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
    }

    setSaving(false);
  };

  const handleAddArea = () => {
    if (newArea.trim() && !mentorshipAreas.includes(newArea.trim())) {
      setMentorshipAreas([...mentorshipAreas, newArea.trim()]);
      setNewArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setMentorshipAreas(mentorshipAreas.filter((a) => a !== area));
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
      <SEO title="Profilim - Mezunlar Derneği" description="Profil bilgilerinizi güncelleyin" />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Profil Bilgileri
              </CardTitle>
              <CardDescription>Kişisel ve profesyonel bilgilerinizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Kişisel Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Kişisel Bilgiler
                  </h3>
                  
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
                      <Label htmlFor="avatar_url">Profil Fotoğrafı URL</Label>
                      <Input
                        id="avatar_url"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biyografi</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Kendinizi kısaca tanıtın..."
                    />
                  </div>
                </div>

                {/* Eğitim Bilgileri */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Eğitim Bilgileri
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="high_school_year">Lise Mezuniyet Yılı</Label>
                      <Select value={highSchoolGraduationYear} onValueChange={setHighSchoolGraduationYear}>
                        <SelectTrigger id="high_school_year">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i).map(
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
                      <Label htmlFor="department">Lise Bölümü</Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Fen, Sosyal, vb."
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="university">Üniversite</Label>
                      <Input
                        id="university"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="Üniversite adı"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="university_status">Üniversite Durumu</Label>
                      <Select value={universityStatus} onValueChange={setUniversityStatus}>
                        <SelectTrigger id="university_status">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studying">Okuyor</SelectItem>
                          <SelectItem value="graduated">Mezun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {universityStatus === "graduated" && (
                    <div className="space-y-2">
                      <Label htmlFor="university_graduation_year">Üniversite Mezuniyet Yılı</Label>
                      <Select value={universityGraduationYear} onValueChange={setUniversityGraduationYear}>
                        <SelectTrigger id="university_graduation_year">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i).map(
                            (year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Profesyonel Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Profesyonel Bilgiler
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profession">Meslek</Label>
                      <Input
                        id="profession"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="Yazılım Geliştirici, Doktor, vb."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Şirket</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Çalıştığınız veya son çalıştığınız şirket"
                      />
                    </div>
                  </div>
                </div>

                {/* Lokasyon Bilgileri */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Lokasyon
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Ülke</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Türkiye">Türkiye</SelectItem>
                          <SelectItem value="ABD">ABD</SelectItem>
                          <SelectItem value="İngiltere">İngiltere</SelectItem>
                          <SelectItem value="Almanya">Almanya</SelectItem>
                          <SelectItem value="Fransa">Fransa</SelectItem>
                          <SelectItem value="Hollanda">Hollanda</SelectItem>
                          <SelectItem value="Kanada">Kanada</SelectItem>
                          <SelectItem value="Avustralya">Avustralya</SelectItem>
                          <SelectItem value="Diğer">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Şehir</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Yaşadığınız şehir"
                      />
                    </div>
                  </div>
                </div>

                {/* İletişim Bilgileri */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    İletişim Bilgileri
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 555 123 4567"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/kullanici"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter/X
                      </Label>
                      <Input
                        id="twitter"
                        type="url"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        placeholder="https://twitter.com/kullanici"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        type="url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/kullanici"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        type="url"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        placeholder="https://facebook.com/kullanici"
                      />
                    </div>
                  </div>
                </div>

                {/* Mentorluk */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_mentor" className="text-base">Mentor olmak ister misiniz?</Label>
                      <p className="text-sm text-muted-foreground">Deneyimlerinizi mezunlarla paylaşın</p>
                    </div>
                    <Switch
                      id="is_mentor"
                      checked={isMentor}
                      onCheckedChange={setIsMentor}
                    />
                  </div>

                  {isMentor && (
                    <div className="space-y-4 border-l-2 border-primary pl-4">
                      <div className="space-y-2">
                        <Label htmlFor="mentor_bio">Mentor Biyografisi</Label>
                        <Textarea
                          id="mentor_bio"
                          value={mentorBio}
                          onChange={(e) => setMentorBio(e.target.value)}
                          rows={3}
                          placeholder="Mentorluk deneyiminizi ve yaklaşımınızı anlatın..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Uzmanlık Alanları</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newArea}
                            onChange={(e) => setNewArea(e.target.value)}
                            placeholder="Alan ekle (örn: Yazılım Geliştirme)"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddArea())}
                          />
                          <Button type="button" onClick={handleAddArea} variant="secondary">
                            Ekle
                          </Button>
                        </div>
                        {mentorshipAreas.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {mentorshipAreas.map((area) => (
                              <Badge key={area} variant="secondary" className="gap-1">
                                {area}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveArea(area)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kaydet
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}