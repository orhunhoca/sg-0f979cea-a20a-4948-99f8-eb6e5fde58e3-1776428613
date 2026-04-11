import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/authService";
import { profileService, type Profile, type SearchFilters } from "@/services/profileService";
import { Loader2, Search, MapPin, Briefcase, GraduationCap, Building, Filter } from "lucide-react";

export default function DirectoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [alumni, setAlumni] = useState<Profile[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    graduation_year: undefined,
    department: "",
    profession: "",
    city: "",
  });
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    setUser(currentUser);
    loadData();
  };

  const loadData = async () => {
    setSearching(true);
    
    const [alumniResult, departmentsResult, citiesResult] = await Promise.all([
      profileService.searchAlumni(filters),
      profileService.getDepartments(),
      profileService.getCities(),
    ]);

    setAlumni(alumniResult.data || []);
    setDepartments(departmentsResult.data || []);
    setCities(citiesResult.data || []);
    
    setSearching(false);
    setLoading(false);
  };

  const handleSearch = () => {
    loadData();
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      graduation_year: undefined,
      department: "",
      profession: "",
      city: "",
    });
    setTimeout(loadData, 100);
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
        title="Mezun Dizini - Mezunlar Derneği"
        description="Mezunları keşfedin, bağlantılar kurun"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Mezun Dizini</h1>
            <p className="text-muted-foreground">
              {alumni.length} mezun bulundu
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <h2 className="text-xl font-heading font-semibold">Arama ve Filtreler</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-3 space-y-2">
                  <Label htmlFor="search">
                    <Search className="h-4 w-4 inline mr-2" />
                    İsim veya E-posta Ara
                  </Label>
                  <Input
                    id="search"
                    placeholder="Ara..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year-filter">Mezuniyet Yılı</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger id="year-filter">
                      <SelectValue placeholder="Tüm yıllar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
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
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters({ ...filters, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bölüm seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tümü</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city-filter">Şehir</Label>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger id="city-filter">
                      <SelectValue placeholder="Tüm şehirler" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="İstanbul">İstanbul</SelectItem>
                      <SelectItem value="Ankara">Ankara</SelectItem>
                      <SelectItem value="İzmir">İzmir</SelectItem>
                      <SelectItem value="Bursa">Bursa</SelectItem>
                      <SelectItem value="Antalya">Antalya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">
                    <Briefcase className="h-4 w-4 inline mr-2" />
                    Meslek
                  </Label>
                  <Input
                    id="profession"
                    placeholder="Örn: Mühendis"
                    value={filters.profession}
                    onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aranıyor...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Ara
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alumni Grid */}
          {searching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : alumni.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Hiç mezun bulunamadı. Filtreleri değiştirmeyi deneyin.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((person) => (
                <Card key={person.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={person.avatar_url || undefined} alt={person.full_name || "User"} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {person.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold truncate">
                          {person.full_name || "Anonim Kullanıcı"}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {person.email}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {person.profession && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{person.profession}</span>
                      </div>
                    )}
                    {person.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{person.company}</span>
                      </div>
                    )}
                    {person.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{person.city}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {person.department && (
                        <Badge variant="secondary" className="text-xs">
                          {person.department}
                        </Badge>
                      )}
                      {person.graduation_year && (
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {person.graduation_year}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" className="w-full mt-3">
                      Profili Görüntüle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}