import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, ShieldAlert, ShoppingBag, Store, UserCheck } from "lucide-react";

interface NavbarProps {
  currentView: "home" | "admin";
  onViewChange: (view: "home" | "admin") => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  clientUser: { name: string; email: string; phone?: string } | null;
  onClientLogout: () => void;
}

export default function Navbar({
  currentView,
  onViewChange,
  darkMode,
  onToggleDarkMode,
  clientUser,
  onClientLogout,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Início", href: "#home" },
    { label: "Produtos", href: "#produtos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Avaliações", href: "#depoimentos" },
    { label: "Contato", href: "#contato" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView !== "home") {
      onViewChange("home");
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#111111]/95 text-white shadow-md py-4 backdrop-blur-md border-b border-white/5"
          : "bg-[#111111]/90 text-white py-5 backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with double click to access Admin Panel */}
          <div
            id="nav-logo"
            onClick={() => {
              onViewChange("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDoubleClick={() => {
              onViewChange("admin");
              alert("Acessando área de administração cwbecomm...");
            }}
            className="flex items-center space-x-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FFE600] flex items-center justify-center transition-transform group-hover:scale-105">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-wider text-white">
                cwbe<span className="text-[#FFE600] font-black">comm</span>
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div id="desktop-menu" className="hidden md:flex items-center space-x-8">
            {currentView === "home" && (
              <div className="flex items-center space-x-6">
                {menuItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="text-sm font-medium text-gray-300 hover:text-[#FFE600] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FFE600] after:transition-all hover:after:w-full"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Icons Actions */}
            <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
              {/* Client Login Status Badge */}
              {clientUser ? (
                <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs">
                  <UserCheck className="w-4 h-4 text-green-400" />
                  <span className="font-semibold max-w-[120px] truncate" title={clientUser.name}>
                    {clientUser.name}
                  </span>
                  <button
                    onClick={onClientLogout}
                    className="text-xs text-gray-400 hover:text-red-400 font-mono pl-1 ml-1 border-l border-white/10 cursor-pointer"
                    title="Desconectar cliente"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 bg-white/5 py-1 px-2.5 rounded-full border border-white/5">
                  Visitante
                </span>
              )}

              {/* Dark mode button */}
              <button
                id="toggle-dark-mode"
                onClick={onToggleDarkMode}
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-[#FFE600] transition-colors"
                title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Admin Panel Toggle - HIDDEN unless already inside admin view to go back */}
              {currentView === "admin" && (
                <button
                  id="go-to-home"
                  onClick={() => onViewChange("home")}
                  className="flex items-center space-x-2 bg-[#FFE600] hover:bg-yellow-500 text-[#111111] text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Voltar à Loja</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Dark mode for mobile */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-[#FFE600]"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-[#111111] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          {currentView === "home" && (
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-[#FFE600] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2 text-xs">
            {/* Client Login status mobile */}
            {clientUser ? (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-gray-300">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-green-400" />
                  <span className="font-semibold block truncate leading-tight select-none">
                    {clientUser.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClientLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-400 hover:underline font-bold"
                >
                  Sair da Conta
                </button>
              </div>
            ) : (
              <div className="p-3 bg-white/5 rounded-xl text-center text-gray-400 font-mono text-[11px]">
                Nenhum cliente autenticado
              </div>
            )}

            {currentView === "admin" && (
              <button
                id="mobile-go-to-home"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onViewChange("home");
                }}
                className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-[#FFE600] text-[#111111] font-bold text-sm shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>Voltar para Loja</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
