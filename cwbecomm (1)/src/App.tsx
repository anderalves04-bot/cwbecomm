import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Review } from "./types";
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from "./data/initialProducts";

// Components Imports
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import ProductCatalog from "./components/ProductCatalog";
import CompanyAbout from "./components/CompanyAbout";
import Reviews from "./components/Reviews";
import ContactForm from "./components/ContactForm";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

const WHATSAPP_NUMBER = "11 95897-5285";

export default function App() {
  const [view, setView] = useState<"home" | "admin">("home");
  const [darkMode, setDarkMode] = useState<boolean>(true); // default to a professional dark-eye-safe mode or user pref
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [clientUser, setClientUser] = useState<{ name: string; email: string; phone?: string } | null>(null);

  // 1. Load Initial Data or LocalStorage Cache
  useEffect(() => {
    // Products Load
    const cachedProducts = localStorage.getItem("ms_outlet_products_v1");
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem("ms_outlet_products_v1", JSON.stringify(INITIAL_PRODUCTS));
    }

    // Reviews Load
    const cachedReviews = localStorage.getItem("ms_outlet_reviews_v1");
    if (cachedReviews) {
      setReviews(JSON.parse(cachedReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem("ms_outlet_reviews_v1", JSON.stringify(INITIAL_REVIEWS));
    }

    // Theme Preference Load
    const themePref = localStorage.getItem("ms_outlet_theme");
    if (themePref) {
      setDarkMode(themePref === "dark");
    } else {
      setDarkMode(true); // default to professional dark theme
    }

    // Client Authentication Load
    const cachedClient = localStorage.getItem("cwbecomm_client_user");
    if (cachedClient) {
      try {
        setClientUser(JSON.parse(cachedClient));
      } catch (e) {
        console.error("Erro ao ler sessão do cliente", e);
      }
    }
  }, []);

  // 2. Synchronize theme toggles to DOM selectors
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("ms_outlet_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("ms_outlet_theme", "light");
    }
  }, [darkMode]);

  // 3. Product modification actions
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => {
      const updated = [...prev, newProd];
      localStorage.setItem("ms_outlet_products_v1", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      localStorage.setItem("ms_outlet_products_v1", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("ms_outlet_products_v1", JSON.stringify(updated));
      return updated;
    });
  };

  // 4. Smooth Anchor Scoller helper
  const handleScrollToSection = (href: string) => {
    setView("home");
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const handleClientLogin = (user: { name: string; email: string; phone?: string }) => {
    setClientUser(user);
    localStorage.setItem("cwbecomm_client_user", JSON.stringify(user));
  };

  const handleClientLogout = () => {
    setClientUser(null);
    localStorage.removeItem("cwbecomm_client_user");
  };

  return (
    <div id="app-root-frame" className="min-h-screen flex flex-col justify-between bg-white dark:bg-neutral-950 text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* Header Menu fixed */}
      <Navbar
        currentView={view}
        onViewChange={setView}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        clientUser={clientUser}
        onClientLogout={handleClientLogout}
      />

      {/* Main View Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === "home" ? (
            <motion.div
              key="landing-page-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero Banner Section */}
              <Hero
                onExploreProducts={() => handleScrollToSection("#produtos")}
                whatsappNumber={WHATSAPP_NUMBER}
              />

              {/* Company Strengths & Benefits Cards */}
              <Benefits />

              {/* Dynamic Catalog Section searching, filtering, modal checkout details */}
              <ProductCatalog 
                products={products} 
                clientUser={clientUser}
                onClientLogin={handleClientLogin}
              />

              {/* About corporate columns tabs pillars */}
              <CompanyAbout />

              {/* Verified client feedback testimonials */}
              <Reviews reviews={reviews} />

              {/* Contact email form coordinates map info */}
              <ContactForm whatsappNumber={WHATSAPP_NUMBER} />
            </motion.div>
          ) : (
            <motion.div
              key="admin-management-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Secured Administration panel */}
              <AdminPanel
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onLogoutToHome={() => setView("home")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Corporate bottom footer navigation */}
      <Footer
        onNavigateSection={handleScrollToSection}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      {/* Floating high-visibility chat action */}
      <WhatsAppButton whatsappNumber={WHATSAPP_NUMBER} />

    </div>
  );
}
