export interface Profile {
  id: string;
  slug: string;
  name: string;
  headline: string;
  role: string;
  location: string;
  video_playback_id: string; // Mux playback ID
  contact_email: string;
  created_at: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
}
