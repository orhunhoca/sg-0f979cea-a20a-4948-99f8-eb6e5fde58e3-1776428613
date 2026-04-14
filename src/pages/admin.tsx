import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { brandService } from "@/services/brandService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2, Users, Download, CheckCircle2, XCircle, Save, X, Tag, Plus, Edit2, Eye, EyeOff, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MembershipRecord {
  id: string;
  membership_number: string;
  email: string;
  full_name: string;
  is_used: boolean;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "brands">("users");
  
  // States
  const [users, setUsers] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [newBrand, setNewBrand] = useState({
    name: "",
    category: "Diğer",
    description: "",
    discount_info: "",
    logo_url: "",
    website_url: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, [router]);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    const { data: profile } = await profileService.getProfileById(session.user.id);
    
    // Geçici olarak tüm giriş yapanları admin paneline alıyoruz (test için)
    // const userProfile = profile as any;
    // if (!userProfile?.is_admin) {
    //   router.push("/");
    //   return;
    // }

    loadUsers();
    loadBrands();
    loadMemberships();
  };

  const loadUsers = async () => {
    const { data } = await profileService.getAllProfiles();
    if (data) setUsers(data);
    setLoading(false);
  };

  const loadBrands = async () => {
    const { data } = await brandService.getAllBrands();
    if (data) setBrands(data);
  };

  const loadMemberships = async () => {
    const { data, error } = await supabase
      .from("membership_numbers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMemberships(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const parseCSV = (text: string): Array<{ email: string; full_name: string; membership_number: string }> => {
    const lines = text.split("\n").filter(line => line.trim());
    const records: Array<{ email: string; full_name: string; membership_number: string }> = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.includes(";") 
        ? line.split(";").map(p => p.trim()) 
        : line.split(",").map(p => p.trim());

      if (parts.length >= 3) {
        const [email, full_name, membership_number] = parts;
        
        if (membership_number && /^\d{8}$/.test(membership_number.trim())) {
          records.push({
            email: email.trim(),
            full_name: full_name.trim(),
            membership_number: membership_number.trim(),
          });
        }
      }
    }

    return records;
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "Hata", description: "Lütfen bir dosya seçin", variant: "destructive" });
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const records = parseCSV(text);

      if (records.length === 0) {
        toast({
          title: "Hata",
          description: "Dosyada geçerli kayıt bulunamadı. Format: Email, Ad Soyad, Üyelik No (8 haneli)",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      const { error } = await supabase.from("membership_numbers").insert(records);

      if (error) {
        toast({ title: "Hata", description: `Kayıtlar eklenirken hata: ${error.message}`, variant: "destructive" });
      } else {
        toast({ title: "Başarılı", description: `${records.length} kayıt başarıyla eklendi` });
        setFile(null);
        loadMemberships();
      }
    } catch (error: any) {
      toast({ title: "Hata", description: `Dosya işlenirken hata: ${error.message}`, variant: "destructive" });
    }

    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("membership_numbers").delete().eq("id", id);
    if (error) {
      toast({ title: "Hata", description: "Kayıt silinemedi", variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Kayıt silindi" });
      loadMemberships();
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Email,Full Name,Membership Number\nahmet@example.com,Ahmet Yılmaz,12345678\nayse@example.com,Ayşe Demir,87654321";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "membership_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const updates: any = {
      is_admin: newRole === "admin",
      is_moderator: newRole === "moderator"
    };

    const { error } = await profileService.updateProfileById(userId, updates);
    if (!error) {
      toast({ title: "Rol güncellendi" });
      loadUsers();
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrand.name || !newBrand.discount_info) {
      toast({ title: "Hata", description: "Marka adı ve indirim bilgisi gerekli", variant: "destructive" });
      return;
    }

    const { error } = await brandService.createBrand(newBrand);
    if (!error) {
      toast({ title: "Marka eklendi" });
      setNewBrand({
        name: "", category: "Diğer", description: "", discount_info: "",
        logo_url: "", website_url: "", is_active: true, display_order: 0,
      });
      loadBrands();
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateBrand = async () => {
    if (!editingBrand) return;
    const { error } = await brandService.updateBrand(editingBrand.id, editingBrand);
    if (!error) {
      toast({ title: "Marka güncellendi" });
      setEditingBrand(null);
      loadBrands();
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm("Bu markayı silmek istediğinizden emin misiniz?")) return;
    const { error } = await brandService.deleteBrand(id);
    if (!error) {
      toast({ title: "Marka silindi" });
      loadBrands();
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleBrand = async (id: string, isActive: boolean) => {
    const { error } = await brandService.toggleBrandStatus(id, isActive);
    if (!error) {
      toast({ title: isActive ? "Marka aktif edildi" : "Marka pasif edildi" });
      loadBrands();
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
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
      <SEO title="Admin Panel - Mezunlar Derneği" description="Yönetim paneli" />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-heading font-bold">Admin Panel</h1>
            </div>

            {/* Toplu Yükleme Bölümü (Her zaman üstte görünsün) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Toplu Üyelik Numarası Yükleme
                </CardTitle>
                <CardDescription>CSV veya Excel dosyasından üyelik numaralarını toplu yükleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Dosya Formatı:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>CSV formatı (virgül veya noktalı virgül ile ayrılmış)</li>
                    <li>İlk satır başlık: Email, Full Name, Membership Number</li>
                    <li>Örnek: ahmet@example.com,Ahmet Yılmaz,12345678</li>
                  </ul>
                  <Button variant="outline" size="sm" onClick={downloadTemplate} className="mt-2">
                    <Download className="h-4 w-4 mr-2" /> Örnek Dosya İndir
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV/Excel Dosyası</Label>
                  <Input id="csv-file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
                  {file && <p className="text-sm text-muted-foreground">Seçilen dosya: {file.name}</p>}
                </div>

                <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
                  {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...</> : <><Upload className="mr-2 h-4 w-4" /> Dosyayı Yükle</>}
                </Button>
              </CardContent>
            </Card>

            {/* SEKMELER */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" /> Kullanıcılar</TabsTrigger>
                <TabsTrigger value="roles"><Shield className="h-4 w-4 mr-2" /> Roller</TabsTrigger>
                <TabsTrigger value="brands"><Tag className="h-4 w-4 mr-2" /> Markalar</TabsTrigger>
              </TabsList>

              {/* SEKME 1: KULLANICILAR */}
              <TabsContent value="users" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistemdeki Kullanıcılar ({users.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ad Soyad</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Üyelik No</TableHead>
                          <TableHead>Kayıt Tarihi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.full_name || 'İsimsiz'}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.membership_number || '-'}</TableCell>
                            <TableCell>{new Date(u.created_at).toLocaleDateString('tr-TR')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEKME 2: ROLLER */}
              <TabsContent value="roles" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Kullanıcı Rolleri</CardTitle>
                    <CardDescription>Sistemdeki yöneticileri ve moderatörleri belirleyin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kullanıcı</TableHead>
                          <TableHead>Mevcut Rol</TableHead>
                          <TableHead>Rol Değiştir</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{u.full_name}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {u.is_admin ? (
                                <Badge className="bg-red-500">Admin</Badge>
                              ) : u.is_moderator ? (
                                <Badge className="bg-blue-500">Moderatör</Badge>
                              ) : (
                                <Badge variant="outline">Kullanıcı</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Select
                                defaultValue={u.is_admin ? "admin" : u.is_moderator ? "moderator" : "user"}
                                onValueChange={(val) => handleRoleUpdate(u.id, val)}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Kullanıcı</SelectItem>
                                  <SelectItem value="moderator">Moderatör</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEKME 3: MARKALAR */}
              <TabsContent value="brands" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Yeni Marka Ekle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Marka Adı *</Label>
                        <Input value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} placeholder="Örn: Starbucks" />
                      </div>
                      <div className="space-y-2">
                        <Label>Kategori</Label>
                        <Select value={newBrand.category} onValueChange={(val) => setNewBrand({ ...newBrand, category: val })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yeme-İçme">Yeme-İçme</SelectItem>
                            <SelectItem value="Giyim">Giyim</SelectItem>
                            <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                            <SelectItem value="Sağlık">Sağlık</SelectItem>
                            <SelectItem value="Eğitim">Eğitim</SelectItem>
                            <SelectItem value="Diğer">Diğer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Açıklama</Label>
                      <Textarea value={newBrand.description} onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>İndirim Bilgisi *</Label>
                      <Input value={newBrand.discount_info} onChange={(e) => setNewBrand({ ...newBrand, discount_info: e.target.value })} placeholder="Örn: %15 indirim" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <Input value={newBrand.logo_url} onChange={(e) => setNewBrand({ ...newBrand, logo_url: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Website URL</Label>
                        <Input value={newBrand.website_url} onChange={(e) => setNewBrand({ ...newBrand, website_url: e.target.value })} />
                      </div>
                    </div>
                    <Button onClick={handleCreateBrand} className="w-full"><Plus className="h-4 w-4 mr-2" /> Marka Ekle</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mevcut Markalar ({brands.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {brands.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Henüz marka eklenmemiş</p>
                    ) : (
                      <div className="space-y-4">
                        {brands.map((brand) => (
                          <Card key={brand.id}>
                            <CardContent className="pt-6">
                              {editingBrand?.id === brand.id ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input value={editingBrand.name} onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} />
                                    <Select value={editingBrand.category} onValueChange={(val) => setEditingBrand({ ...editingBrand, category: val })}>
                                      <SelectTrigger><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Yeme-İçme">Yeme-İçme</SelectItem>
                                        <SelectItem value="Giyim">Giyim</SelectItem>
                                        <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                                        <SelectItem value="Sağlık">Sağlık</SelectItem>
                                        <SelectItem value="Eğitim">Eğitim</SelectItem>
                                        <SelectItem value="Diğer">Diğer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Textarea value={editingBrand.description || ""} onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })} rows={2} />
                                  <Input value={editingBrand.discount_info} onChange={(e) => setEditingBrand({ ...editingBrand, discount_info: e.target.value })} />
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input value={editingBrand.logo_url || ""} onChange={(e) => setEditingBrand({ ...editingBrand, logo_url: e.target.value })} placeholder="Logo URL" />
                                    <Input value={editingBrand.website_url || ""} onChange={(e) => setEditingBrand({ ...editingBrand, website_url: e.target.value })} placeholder="Website URL" />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={handleUpdateBrand} size="sm"><Save className="h-4 w-4 mr-2" /> Kaydet</Button>
                                    <Button onClick={() => setEditingBrand(null)} size="sm" variant="outline"><X className="h-4 w-4 mr-2" /> İptal</Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="font-semibold text-lg">{brand.name}</h3>
                                      <Badge variant="outline">{brand.category}</Badge>
                                      {!brand.is_active && <Badge variant="secondary">Pasif</Badge>}
                                    </div>
                                    {brand.description && <p className="text-sm text-muted-foreground mb-2">{brand.description}</p>}
                                    <p className="text-sm font-medium text-green-600">{brand.discount_info}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleToggleBrand(brand.id, !brand.is_active)}>
                                      {brand.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingBrand(brand)}><Edit2 className="h-4 w-4" /></Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteBrand(brand.id)}><Trash2 className="h-4 w-4" /></Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}