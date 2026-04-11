import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/authService";
import { eventService } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, MapPin, Users, Plus } from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      router.push("/auth/login");
    } else {
      setUser(currentUser);
      loadEvents();
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    const { data, error } = await eventService.getUpcomingEvents();
    if (!error && data) {
      setEvents(data);
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
        title="Etkinlikler - Mezunlar Derneği"
        description="Yaklaşan mezun etkinlikleri"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold">Etkinlikler</h1>
                <p className="text-muted-foreground mt-1">Yaklaşan mezun buluşmaları ve etkinlikler</p>
              </div>
              <Button asChild>
                <Link href="/events/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Etkinlik Oluştur
                </Link>
              </Button>
            </div>

            {events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Yaklaşan etkinlik bulunmuyor</p>
                  <Button asChild className="mt-4">
                    <Link href="/events/create">İlk Etkinliği Oluştur</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.event_date).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {event.description}
                        </p>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{event.location}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {event.event_attendees?.[0]?.count || 0} katılımcı
                          </span>
                        </div>
                        
                        {event.capacity && (
                          <Badge variant="outline">
                            Kapasite: {event.capacity}
                          </Badge>
                        )}
                      </div>

                      <Button asChild className="w-full mt-4">
                        <Link href={`/events/${event.id}`}>
                          Detayları Gör
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}