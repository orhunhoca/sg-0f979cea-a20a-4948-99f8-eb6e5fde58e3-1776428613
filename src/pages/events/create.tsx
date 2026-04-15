import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { eventService } from "@/services/eventService";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [eventType, setEventType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) return;

    console.log("=== EVENT CREATE FORM SUBMIT ===");
    console.log("Form Data:", { title, description, eventDate, eventTime, location, capacity, eventType });

    // Validation
    if (!title?.trim()) {
      toast({
        title: "Hata",
        description: "Etkinlik başlığı gerekli",
        variant: "destructive",
      });
      return;
    }

    if (!eventDate) {
      toast({
        title: "Hata",
        description: "Tarih gerekli",
        variant: "destructive",
      });
      return;
    }

    if (!location?.trim()) {
      toast({
        title: "Hata",
        description: "Konum gerekli",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    const dateTime = `${eventDate}T${eventTime}:00`;

    try {
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("Auth check:", { user: user?.id, authError });

      if (!user) {
        toast({
          title: "Hata",
          description: "Giriş yapmanız gerekiyor",
          variant: "destructive",
        });
        setCreating(false);
        router.push("/auth/login");
        return;
      }

      // Prepare event data
      const eventData = {
        title: title.trim(),
        description: description?.trim() || null,
        event_date: dateTime,
        location: location.trim(),
        capacity: capacity ? parseInt(capacity) : null,
        is_approved: true,
      };

      console.log("Sending event data:", eventData);

      // Create event
      const { data, error } = await eventService.createEvent(eventData);
      
      console.log("Create event result:", { data, error });

      if (error) {
        console.error("Event creation error details:", error);
        toast({
          title: "Hata",
          description: error.message || "Etkinlik oluşturulamadı",
          variant: "destructive",
        });
        setCreating(false);
        return;
      }

      console.log("Event created successfully:", data);

      toast({
        title: "Başarılı!",
        description: "Etkinlik oluşturuldu",
      });

      // Redirect to events page
      setTimeout(() => {
        router.push("/events");
      }, 500);

    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({
        title: "Hata",
        description: err.message || "Bir hata oluştu",
        variant: "destructive",
      });
      setCreating(false);
    }
  };

  return (
    <>
      <SEO 
        title="Etkinlik Oluştur - Mezunlar Derneği"
        description="Yeni etkinlik oluşturun"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Yeni Etkinlik Oluştur</CardTitle>
                <CardDescription>
                  Mezunlar için etkinlik düzenleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Etkinlik Adı *</Label>
                    <Input
                      id="title"
                      placeholder="Örn: Yıllık Mezunlar Buluşması 2026"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      placeholder="Etkinlik hakkında detaylı bilgi..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Tarih *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Saat *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Konum</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Örn: Hilton Oteli, İstanbul"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasite (Opsiyonel)</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="Maksimum katılımcı sayısı"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="pl-9"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_type">Etkinlik Tipi</Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger id="event_type">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meetup">Buluşma</SelectItem>
                        <SelectItem value="seminar">Seminer</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="social">Sosyal Etkinlik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      İptal
                    </Button>
                    <Button
                      type="submit"
                      disabled={creating}
                      className="flex-1"
                    >
                      {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Etkinlik Oluştur
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}