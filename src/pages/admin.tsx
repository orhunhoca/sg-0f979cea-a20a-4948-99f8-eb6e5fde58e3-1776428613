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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2, Users, Download, CheckCircle2, XCircle } from "lucide-react";
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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
    } else {
      setUser(currentUser);
      loadMemberships();
      setLoading(false);
    }
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
          </div>
        </main>
      </div>
    </>
  );
}