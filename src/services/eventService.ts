import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
type EventAttendee = Database["public"]["Tables"]["event_attendees"]["Row"];

export const eventService = {
  async getAllEvents() {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey(id, full_name, avatar_url),
        event_attendees(count)
      `)
      .eq("is_approved", true)
      .order("event_date", { ascending: true });

    return { data, error };
  },

  async getUpcomingEvents() {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey(id, full_name, avatar_url),
        event_attendees(count)
      `)
      .eq("is_approved", true)
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(10);

    return { data, error };
  },

  async getEventById(eventId: string) {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey(id, full_name, avatar_url),
        event_attendees(
          id,
          status,
          user:profiles!event_attendees_user_id_fkey(id, full_name, avatar_url)
        )
      `)
      .eq("id", eventId)
      .single();

    return { data, error };
  },

  async createEvent(event: EventInsert) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("events")
      .insert({
        ...event,
        organizer_id: user?.id,
      })
      .select()
      .single();

    return { data, error };
  },

  async updateEvent(eventId: string, updates: EventUpdate) {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", eventId)
      .select()
      .single();

    return { data, error };
  },

  async deleteEvent(eventId: string) {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    return { error };
  },

  async rsvpToEvent(eventId: string, status: "attending" | "maybe" | "not_attending") {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("event_attendees")
      .upsert({
        event_id: eventId,
        user_id: user?.id,
        status,
      })
      .select()
      .single();

    return { data, error };
  },

  async removeRSVP(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("event_attendees")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user?.id);

    return { error };
  },

  async getUserRSVP(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("event_attendees")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", user?.id)
      .maybeSingle();

    return { data, error };
  },

  async getMyEvents() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        event_attendees(count)
      `)
      .eq("organizer_id", user?.id)
      .order("event_date", { ascending: false });

    return { data, error };
  },
};