import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "brands">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
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
    const { data: { user } } = await authService.getSession();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: profile } = await profileService.getProfile(user.id);
    if (!profile?.is_admin) {
      router.push("/");
      return;
    }

    loadUsers();
    loadBrands();
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

      // Handle both comma and semicolon separators
      const parts = line.includes(";") 
        ? line.split(";").map(p => p.trim()) 
        : line.split(",").map(p => p.trim());

      if (parts.length >= 3) {
        const [email, full_name, membership_number] = parts;
        
        // Validate membership number (8 digits)
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
      toast({
        title: "Hata",
        description: "Lütfen bir dosya seçin",
        variant: "destructive",
      });
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

      // Insert records
      const { error } = await supabase
        .from("membership_numbers")
        .insert(records);

      if (error) {
        toast({
          title: "Hata",
          description: `Kayıtlar eklenirken hata oluştu: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: `${records.length} kayıt başarıyla eklendi`,
        });
        setFile(null);
        loadMemberships();
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: `Dosya işlenirken hata: ${error.message}`,
        variant: "destructive",
      });
    }

    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("membership_numbers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Hata",
        description: "Kayıt silinemedi",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Başarılı",
        description: "Kayıt silindi",
      });
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
    const updates: any = {};
    
    if (newRole === "admin") {
      updates.is_admin = true;
      updates.is_moderator = false;
    } else if (newRole === "moderator") {
      updates.is_admin = false;
      updates.is_moderator = true;
    } else {
      updates.is_admin = false;
      updates.is_moderator = false;
    }

    const { error } = await profileService.updateProfile(userId, updates);
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
        name: "",
        category: "Diğer",
        description: "",
        discount_info: "",
        logo_url: "",
        website_url: "",
        is_active: true,
        display_order: 0,
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
      <SEO 
        title="Admin Panel - Mezunlar Derneği"
        description="Yönetim paneli"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-heading font-bold">Admin Panel</h1>
            </div>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Toplu Üyelik Numarası Yükleme
                </CardTitle>
                <CardDescription>
                  CSV veya Excel dosyasından üyelik numaralarını toplu olarak yükleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Dosya Formatı:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>CSV formatı (virgül veya noktalı virgül ile ayrılmış)</li>
                    <li>İlk satır başlık: Email, Full Name, Membership Number</li>
                    <li>Üyelik numarası tam 8 haneli olmalı</li>
                    <li>Örnek: ahmet@example.com,Ahmet Yılmaz,12345678</li>
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTemplate}
                    className="mt-2"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Örnek Dosya İndir
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV/Excel Dosyası</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Seçilen dosya: {file.name}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Dosyayı Yükle
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Memberships List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Üyelik Numaraları ({memberships.length})
                  </span>
                </CardTitle>
                <CardDescription>
                  Sistemdeki tüm üyelik numaraları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Ad Soyad</TableHead>
                        <TableHead>Üyelik No</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead className="text-right">İşlem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberships.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            Henüz üyelik numarası yüklenmemiş
                          </TableCell>
                        </TableRow>
                      ) : (
                        memberships.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.email}</TableCell>
                            <TableCell>{record.full_name}</TableCell>
                            <TableCell>
                              <code className="bg-muted px-2 py-1 rounded">
                                {record.membership_number}
                              </code>
                            </TableCell>
                            <TableCell>
                              {record.is_used ? (
                                <Badge variant="secondary" className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Kullanıldı
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1">
                                  <XCircle className="h-3 w-3" />
                                  Bekliyor
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(record.created_at).toLocaleDateString("tr-TR")}
                            </TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bu üyelik numarası kalıcı olarak silinecek.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(record.id)}>
                                      Sil
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Brands Tab */}
            <TabsContent value="brands" className="space-y-6">
              {/* Add New Brand */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Yeni Marka Ekle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Marka Adı *</label>
                      <Input
                        value={newBrand.name}
                        onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                        placeholder="Örn: Starbucks"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kategori</label>
                      <select
                        value={newBrand.category}
                        onChange={(e) => setNewBrand({ ...newBrand, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="Yeme-İçme">Yeme-İçme</option>
                        <option value="Giyim">Giyim</option>
                        <option value="Teknoloji">Teknoloji</option>
                        <option value="Sağlık">Sağlık</option>
                        <option value="Eğitim">Eğitim</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Açıklama</label>
                    <Textarea
                      value={newBrand.description}
                      onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                      placeholder="Marka hakkında kısa bilgi"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">İndirim Bilgisi *</label>
                    <Input
                      value={newBrand.discount_info}
                      onChange={(e) => setNewBrand({ ...newBrand, discount_info: e.target.value })}
                      placeholder="Örn: %15 indirim"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Logo URL</label>
                      <Input
                        value={newBrand.logo_url}
                        onChange={(e) => setNewBrand({ ...newBrand, logo_url: e.target.value })}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website URL</label>
                      <Input
                        value={newBrand.website_url}
                        onChange={(e) => setNewBrand({ ...newBrand, website_url: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sıralama</label>
                    <Input
                      type="number"
                      value={newBrand.display_order}
                      onChange={(e) => setNewBrand({ ...newBrand, display_order: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <Button onClick={handleCreateBrand} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Marka Ekle
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Brands */}
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
                                  <Input
                                    value={editingBrand.name}
                                    onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                                    placeholder="Marka Adı"
                                  />
                                  <select
                                    value={editingBrand.category}
                                    onChange={(e) => setEditingBrand({ ...editingBrand, category: e.target.value })}
                                    className="px-3 py-2 border rounded-md"
                                  >
                                    <option value="Yeme-İçme">Yeme-İçme</option>
                                    <option value="Giyim">Giyim</option>
                                    <option value="Teknoloji">Teknoloji</option>
                                    <option value="Sağlık">Sağlık</option>
                                    <option value="Eğitim">Eğitim</option>
                                    <option value="Diğer">Diğer</option>
                                  </select>
                                </div>
                                <Textarea
                                  value={editingBrand.description || ""}
                                  onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                                  placeholder="Açıklama"
                                  rows={2}
                                />
                                <Input
                                  value={editingBrand.discount_info}
                                  onChange={(e) => setEditingBrand({ ...editingBrand, discount_info: e.target.value })}
                                  placeholder="İndirim Bilgisi"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    value={editingBrand.logo_url || ""}
                                    onChange={(e) => setEditingBrand({ ...editingBrand, logo_url: e.target.value })}
                                    placeholder="Logo URL"
                                  />
                                  <Input
                                    value={editingBrand.website_url || ""}
                                    onChange={(e) => setEditingBrand({ ...editingBrand, website_url: e.target.value })}
                                    placeholder="Website URL"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleUpdateBrand} size="sm">
                                    <Save className="h-4 w-4 mr-2" />
                                    Kaydet
                                  </Button>
                                  <Button onClick={() => setEditingBrand(null)} size="sm" variant="outline">
                                    <X className="h-4 w-4 mr-2" />
                                    İptal
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg">{brand.name}</h3>
                                    <Badge variant="outline">{brand.category}</Badge>
                                    {!brand.is_active && (
                                      <Badge variant="secondary">Pasif</Badge>
                                    )}
                                  </div>
                                  {brand.description && (
                                    <p className="text-sm text-muted-foreground mb-2">{brand.description}</p>
                                  )}
                                  <p className="text-sm font-medium text-green-600">{brand.discount_info}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleToggleBrand(brand.id, !brand.is_active)}
                                  >
                                    {brand.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingBrand(brand)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteBrand(brand.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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
          </div>
        </main>
      </div>
    </>
  );
}