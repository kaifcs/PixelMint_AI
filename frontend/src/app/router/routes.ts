export const appRoutes = {
  home: "/",
  features: "/#features",
  pricing: "/#pricing",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  workspace: "/workspace",
  profile: "/profile",
} as const;

export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];
