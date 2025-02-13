export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FinanceFox",
  description: "FinanceFox is a platform for managing your finances.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Login",
      href: "/auth/login",
    },
    {
      label: "Register",
      href: "/auth/register",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/o1sumitkumar",
    twitter: "https://twitter.com/o1sumitkumar",
    docs: "https://o1sumitkumar.com",
    discord: "https://discord.gg/o1sumitkumar",
    sponsor: "https://patreon.com/o1sumitkumar",
  },
};
