export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan: "FREE" | "PRO";
  created_at?: string;
  updated_at?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  accessToken: string;
  profile: UserProfile;
}
