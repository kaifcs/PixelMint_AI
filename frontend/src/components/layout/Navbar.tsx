import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/app/router/routes";
import { NavLink } from "@/components/common/NavLink";
import { useAuth } from "@/features/auth/auth-context";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = user
    ? [
        { label: "Home", href: appRoutes.home },
        { label: "Pricing", href: appRoutes.pricing },
        { label: "Overview", href: appRoutes.dashboard },
        { label: "Archive", href: `${appRoutes.dashboard}#history` },
      ]
    : [
        { label: "Home", href: appRoutes.home },
        { label: "Features", href: appRoutes.features },
        { label: "Pricing", href: appRoutes.pricing },
        { label: "About", href: appRoutes.about },
        { label: "Contact", href: appRoutes.contact },
      ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href === appRoutes.home && window.location.pathname === appRoutes.home) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (window.location.pathname === path || (path === "" && window.location.pathname === "/")) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090D16]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40 py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={appRoutes.home} className="flex items-center gap-2.5 group min-h-[44px]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">
              PixelMint <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 min-h-[44px] flex items-center"
                activeClassName="text-white font-semibold"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 border-0 min-h-[40px]"
                  asChild
                >
                  <Link to={appRoutes.workspace}>AI Studio</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium min-h-[40px]"
                >
                  <Link to={appRoutes.profile}>Profile</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl font-medium text-sm min-h-[40px]">
                  <Link to={appRoutes.login}>Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 border-0 flex items-center gap-1.5 min-h-[40px]"
                  asChild
                >
                  <Link to={appRoutes.signup}>
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen ? (
        <div className="md:hidden bg-[#0A0E18]/95 backdrop-blur-2xl border-t border-white/[0.08] mt-3 py-6 px-6 space-y-4 shadow-2xl animate-fade-in-up pb-8">
          <div className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className="flex items-center text-base font-medium text-slate-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 transition-colors min-h-[44px]"
                activeClassName="text-white font-semibold bg-white/[0.06]"
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            {user ? (
              <>
                <Button asChild className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3.5 min-h-[48px] border-0">
                  <Link to={appRoutes.workspace} onClick={() => setIsOpen(false)}>AI Studio</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-center rounded-xl border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 py-3.5 min-h-[48px]">
                  <Link to={appRoutes.profile} onClick={() => setIsOpen(false)}>Profile</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="w-full justify-center rounded-xl text-slate-300 hover:bg-white/5 py-3 font-medium min-h-[48px]">
                  <Link to={appRoutes.login} onClick={() => setIsOpen(false)}>Sign in</Link>
                </Button>
                <Button
                  className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold py-3.5 shadow-lg shadow-indigo-500/25 border-0 min-h-[48px]"
                  asChild
                >
                  <Link to={appRoutes.signup} onClick={() => setIsOpen(false)}>Get Started Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
