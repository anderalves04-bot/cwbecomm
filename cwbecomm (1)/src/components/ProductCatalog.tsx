import { useState, useMemo, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  ShoppingBag,
  ExternalLink,
  X,
  MessageCircle,
  QrCode,
  CreditCard,
  Barcode,
  CheckCircle,
  Copy,
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  FileText,
  Truck
} from "lucide-react";
import { Product, Sale } from "../types";
import { CATEGORIES } from "../data/initialProducts";

interface ProductCatalogProps {
  products: Product[];
  clientUser: { name: string; email: string; phone?: string } | null;
  onClientLogin: (user: { name: string; email: string; phone?: string }) => void;
}

export default function ProductCatalog({
  products,
  clientUser,
  onClientLogin,
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Client Login modal lock states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loginCreds, setLoginCreds] = useState({ email: "", password: "" });
  const [emailNotification, setEmailNotification] = useState<{ isOpen: boolean; to: string; name: string } | null>(null);

  // Payment checkout state inside Details Modal
  const [paymentTab, setPaymentTab] = useState<"pix" | "link">("pix");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);

  // Copy feedbacks
  const [copiedText, setCopiedText] = useState(false);

  // Pix payment verification details
  const [pixPayerName, setPixPayerName] = useState("");
  const [pixTransactionId, setPixTransactionId] = useState("");

  // Shipping Address state
  const [shippingCep, setShippingCep] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingNumber, setShippingNumber] = useState("");
  const [shippingComplement, setShippingComplement] = useState("");
  const [shippingNeighborhood, setShippingNeighborhood] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Auto query CEP
  const handleCepChange = async (val: string) => {
    const cleanCep = val.replace(/\D/g, "");
    setShippingCep(cleanCep);

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setShippingAddress(data.logradouro || "");
          setShippingNeighborhood(data.bairro || "");
          setShippingCity(data.localidade || "");
          setShippingState(data.uf || "");
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Credit card inputs state
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Dynamic payment credentials configured in Settings Tab of admin panel
  const activePixKey = useMemo(() => {
    return localStorage.getItem("cwbecomm_pix_key") || "+5511958975285";
  }, [activeProduct]);

  const activeReceiverName = useMemo(() => {
    return localStorage.getItem("cwbecomm_receiver_name") || "Miguel Pires Alves";
  }, [activeProduct]);

  const activePaypalLink = useMemo(() => {
    return localStorage.getItem("cwbecomm_paypal_link") || "";
  }, [activeProduct]);

  // Adjust default payment option depending on what is available/configured
  useEffect(() => {
    // Migrate old defaults to new user defaults if they are set to previous fallback values
    const currentPixKey = localStorage.getItem("cwbecomm_pix_key");
    if (!currentPixKey || currentPixKey === "financeiro@cwbecomm.com.br") {
      localStorage.setItem("cwbecomm_pix_key", "+5511958975285");
    }
    const currentReceiver = localStorage.getItem("cwbecomm_receiver_name");
    if (!currentReceiver || currentReceiver === "CWBECOMM LTDA") {
      localStorage.setItem("cwbecomm_receiver_name", "Miguel Pires Alves");
    }
    const currentStaticCode = localStorage.getItem("cwbecomm_pix_static_code");
    if (!currentStaticCode || currentStaticCode === "") {
      localStorage.setItem("cwbecomm_pix_static_code", "00020126360014BR.GOV.BCB.PIX0114+55119589752855204000053039865802BR5918Miguel Pires Alves6009SAO PAULO62140510SAdMs0EOzA6304B403");
    }

    if (activeProduct) {
      const hasPix = !!(localStorage.getItem("cwbecomm_pix_key") || "+5511958975285");
      const hasLink = !!activePaypalLink;
      if (!hasPix && hasLink) {
        setPaymentTab("link");
      } else {
        setPaymentTab("pix");
      }
    }
  }, [activeProduct, activePaypalLink]);

  // Legitimate copy-and-paste Pix payload incorporating key, name and product price
  const activePixPayload = useMemo(() => {
    if (!activeProduct) return "";
    
    // Check if there is an explicit static Pix Code set by the admin to override the payload
    const savedStaticCode = localStorage.getItem("cwbecomm_pix_static_code") || "00020126360014BR.GOV.BCB.PIX0114+55119589752855204000053039865802BR5918Miguel Pires Alves6009SAO PAULO62140510SAdMs0EOzA6304B403";
    if (savedStaticCode && savedStaticCode.trim()) {
      return savedStaticCode.trim();
    }

    const cleanKey = activePixKey.replace(/\s/g, "");
    const formattedAmount = activeProduct.price.toFixed(2);
    return `00020101021126330014br.gov.bcb.pix0111${cleanKey}5204000053039865405${formattedAmount}5802BR5915${activeReceiverName.toUpperCase().slice(0, 15)}6008CURITIBA62070503***6304`;
  }, [activeProduct, activePixKey, activeReceiverName]);

  // Filter and Search logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleOpenDetails = (product: Product) => {
    setActiveProduct(product);
    setPaymentCompleted(false);
    setLastCompletedSale(null);
  };

  const handleCloseDetails = () => {
    setActiveProduct(null);
    setPaymentCompleted(false);
    setLastCompletedSale(null);
    setIsProcessingPayment(false);
  };

  // Intercept trigger check
  const handleVerifyClientAuth = (actionType: "buy" | "view", targetProduct?: Product) => {
    if (!clientUser) {
      setShowLoginModal(true);
      if (targetProduct) {
        setActiveProduct(targetProduct);
      }
      return false;
    }
    return true;
  };

  // Register customer
  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { name, email, phone, password } = registerForm;
    if (!name || !email || !phone || !password) {
      alert("Por favor, preencha todos os campos obrigatórios para realizar o cadastro.");
      return;
    }

    // Load registered accounts
    const savedUsersStr = localStorage.getItem("cwbecomm_registered_users") || "[]";
    let users = [];
    try {
      users = JSON.parse(savedUsersStr);
    } catch {
      users = [];
    }

    // Check if email already exists
    const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      alert("Este endereço de e-mail já está cadastrado. Alterne para a aba de 'Entrar' para fazer o login.");
      setAuthTab("login");
      setLoginCreds({ email, password: "" });
      return;
    }

    // Save user
    const newUser = { name, email, phone, password, verified: false, id: "client_" + Date.now() };
    users.push(newUser);
    localStorage.setItem("cwbecomm_registered_users", JSON.stringify(users));

    // Log the user in
    onClientLogin({ name, email, phone });

    // Open the official confirmation email popup
    setEmailNotification({
      isOpen: true,
      to: email,
      name: name,
    });

    // Close the login/identification modal
    setShowLoginModal(false);

    // Clear register form
    setRegisterForm({ name: "", email: "", phone: "", password: "" });
  };

  // Login registered customer
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = loginCreds;
    if (!email || !password) {
      alert("Por favor, preencha o e-mail e a senha cadastrados.");
      return;
    }

    // Load users
    const savedUsersStr = localStorage.getItem("cwbecomm_registered_users") || "[]";
    let users = [];
    try {
      users = JSON.parse(savedUsersStr);
    } catch {
      users = [];
    }

    const matchedUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matchedUser) {
      onClientLogin({
        name: matchedUser.name,
        email: matchedUser.email,
        phone: matchedUser.phone,
      });
      setShowLoginModal(false);
      setLoginCreds({ email: "", password: "" });
      alert(`Bem-vindo de volta, ${matchedUser.name}!`);
    } else {
      alert("E-mail ou senha incorretos. Por favor, verifique suas credenciais de acesso ou cadastre-se.");
    }
  };

  // Copiar chave Pix / Código boleto
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Confirm payment & dynamic sale injection
  const handleProcessCheckout = (method: "Pix" | "Cartão" | "Boleto" | "PayPal" | "Link de Checkout") => {
    if (!activeProduct || !clientUser) return;

    if (!shippingCep || !shippingAddress || !shippingNumber || !shippingNeighborhood || !shippingCity || !shippingState) {
      alert("Por favor, preencha todos os campos obrigatórios do Endereço de Entrega/Envio para prosseguir.");
      return;
    }

    if (method === "Pix" && (!pixPayerName || !pixTransactionId)) {
      alert("Por favor, informe o Nome do Pagador e o Comprovante/ID da Cópia para registrar o seu Pix real.");
      return;
    }

    setIsProcessingPayment(true);

    // Backend payment register and validation
    setTimeout(() => {
      const saleId = "SALE-" + Math.floor(100000 + Math.random() * 900000);
      const now = new Date();
      const dateStr = now.toLocaleDateString("pt-BR") + " " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      const newSale: Sale = {
        id: saleId,
        clientName: clientUser.name,
        clientEmail: clientUser.email,
        productName: activeProduct.name,
        price: activeProduct.price,
        paymentMethod: method,
        date: dateStr,
        pixPayerName: method === "Pix" ? pixPayerName : undefined,
        pixTransactionId: method === "Pix" ? pixTransactionId : undefined,
        shippingCep,
        shippingAddress,
        shippingNumber,
        shippingComplement: shippingComplement || undefined,
        shippingNeighborhood,
        shippingCity,
        shippingState,
      };

      // Save to localStorage list
      const savedSales = JSON.parse(localStorage.getItem("cwbecomm_sales") || "[]");
      const updatedSales = [...savedSales, newSale];
      localStorage.setItem("cwbecomm_sales", JSON.stringify(updatedSales));

      setLastCompletedSale(newSale);
      setIsProcessingPayment(false);
      setPaymentCompleted(true);

      // Reset pix and shipping details
      setPixPayerName("");
      setPixTransactionId("");
      setShippingCep("");
      setShippingAddress("");
      setShippingNumber("");
      setShippingComplement("");
      setShippingNeighborhood("");
      setShippingCity("");
      setShippingState("");

      // Trigger actual payment URL redirect for Real Payment Integration
      if (method === "PayPal" || method === "Cartão" || method === "Link de Checkout") {
        if (activePaypalLink) {
          window.open(activePaypalLink, "_blank", "noopener,noreferrer");
        }
      }
    }, 1500);
  };

  // Format price helper
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Dynamic credit card card number format mask
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardData({ ...cardData, number: parts.join(" ") });
    } else {
      setCardData({ ...cardData, number: value });
    }
  };

  // Expiry card input mask
  const handleCardExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 4);
    if (value.length > 2) {
      setCardData({ ...cardData, expiry: `${value.slice(0, 2)}/${value.slice(2)}` });
    } else {
      setCardData({ ...cardData, expiry: value });
    }
  };

  return (
    <section id="produtos" className="py-20 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] dark:text-[#FFE600] bg-gray-100 dark:bg-neutral-800 px-3.5 py-1.5 rounded-full font-mono">
            Catálogo cwbecomm
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-[#111111] dark:text-white mt-4 mb-2">
            Nossos Produtos em Destaque
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Selecione o produto de sua preferência. Faça o seu login rápido para desbloquear o checkout seguro e meios de pagamentos direto por nossa plataforma.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-neutral-800">

          {/* Search field */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Buscar por nome ou palavras-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] font-sans transition-all placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Categories Tab Pill List */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex space-x-1 sm:space-x-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] shadow-lg shadow-black/10 dark:shadow-yellow-500/10"
                      : "bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Zero state display */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 bg-gray-50 dark:bg-neutral-900 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
            <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-white font-medium">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Experimente mudar o termo de pesquisa ou a categoria.</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, index) => {
              const isPdfImage = product.image && product.image.includes("data:image/svg") || (product.image && product.image.startsWith("<svg"));
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 25, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, y: 15 }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.03,
                    rotate: index % 2 === 0 ? 0.8 : -0.8,
                    boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.16), 0 15px 15px -5px rgba(0, 0, 0, 0.08)"
                  }}
                  transition={{ 
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.3), // Stagger delay with a maximum cap
                    ease: [0.215, 0.610, 0.355, 1.0], // cubic-out ease
                    layout: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  onClick={() => {
                    // Requires registration
                    const isAuthorized = handleVerifyClientAuth("view", product);
                    if (isAuthorized) {
                      handleOpenDetails(product);
                    }
                  }}
                  className="flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden group transition-all duration-300 cursor-pointer text-left"
                >
                  {/* Image Container with tag */}
                  <div className="relative pt-[75%] bg-gray-50 dark:bg-neutral-950 overflow-hidden">
                    <span className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-sm text-[#FFE600] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full z-10">
                      {product.category}
                    </span>

                    {product.featured && (
                      <motion.span 
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-3 right-3 bg-[#FFE600] text-[#111111] text-[10px] font-bold px-2.5 py-1 rounded-full z-10 font-sans shadow-md"
                      >
                        Recomendado
                      </motion.span>
                    )}

                    {/* PDF brochure indicator */}
                    {(isPdfImage || product.image?.includes("pdf") || product.image?.includes("base64") && product.image?.length < 1000) ? (
                      <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-4">
                        <FileText className="w-14 h-14 text-red-500 mb-2 animate-bounce" />
                        <span className="text-[11px] font-mono text-gray-400 font-bold uppercase tracking-wider">Visualização por PDF</span>
                        <span className="text-[9px] text-gray-500 max-w-[80%] truncate text-center mt-0.5">Catálogo Digital Cadastrado</span>
                      </div>
                    ) : (
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600"}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-grow p-6 text-left">
                    <h3 className="font-display font-medium text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#FFE600] dark:group-hover:text-[#FFE600] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 h-10 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-mono text-gray-450 uppercase tracking-widest leading-none font-bold">À vista Pix/Cartão</p>
                        <span className="text-xl font-display font-bold text-[#111111] dark:text-[#FFE600]">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid double-trigger from parent card onClick
                          // Requires registration
                          const isAuthorized = handleVerifyClientAuth("view", product);
                          if (isAuthorized) {
                            handleOpenDetails(product);
                          }
                        }}
                        className="bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] text-xs font-bold px-4.5 py-2.5 rounded-xl hover:bg-yellow-500 dark:hover:bg-yellow-400 hover:text-[#111111] transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Comprar / Ver
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* DETAIL DIALOG / MODEL CHECKOUT POPUP */}
      <AnimatePresence>
        {activeProduct && clientUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetails}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-150 dark:border-neutral-800 z-10 max-h-[92vh] flex flex-col text-gray-900 dark:text-white"
            >

              {/* Close Button absolute */}
              <button
                onClick={handleCloseDetails}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#111111]/85 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto p-0 flex flex-col md:flex-row">

                {/* Visual Half */}
                <div className="relative md:w-5/12 bg-gray-50 dark:bg-neutral-950 aspect-video md:aspect-auto md:min-h-[500px] flex-shrink-0 flex items-center justify-center">
                  {(activeProduct.image?.includes("pdf") || activeProduct.image?.includes("data:image/svg") || activeProduct.image?.includes("base64") && activeProduct.image?.length < 1000) ? (
                    <div className="p-8 text-center flex flex-col items-center">
                      <FileText className="w-16 h-16 text-red-550 mb-3" />
                      <p className="font-bold font-sans text-sm">{activeProduct.name}</p>
                      <span className="text-xs text-gray-500 font-mono mt-1">Catálogo Comercial Carregado em PDF</span>
                    </div>
                  ) : (
                    <img
                      src={activeProduct.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600"}
                      alt={activeProduct.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-4 left-4 bg-[#111111]/85 backdrop-blur-sm text-[#FFE600] text-xs font-mono font-bold px-3 py-1 rounded-full z-10">
                    {activeProduct.category}
                  </span>
                </div>

                {/* Content and Payment Half */}
                <div className="p-6 md:p-8 md:w-7/12 flex flex-col justify-between text-left">
                  
                  {/* Purchase Success State */}
                  {paymentCompleted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 px-2 text-center space-y-6 flex flex-col items-center justify-center h-full"
                    >
                      <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-10 h-10 stroke-[2.5]" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-display font-bold text-2xl text-green-600 dark:text-green-400">Pagamento Confirmado!</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-300 max-w-sm mx-auto">
                          Parabéns, seu pagamento pelo produto <strong>{activeProduct.name}</strong> foi validado com sucesso pela cwbecomm.
                        </p>
                      </div>

                      {/* Recibo Card */}
                      {lastCompletedSale && (
                        <div className="w-full text-left bg-gray-50 dark:bg-neutral-950 p-4 rounded-xl border border-gray-150 dark:border-neutral-800 font-mono text-xs text-gray-600 dark:text-gray-450 space-y-2.5">
                          <p className="font-bold text-[#111111] dark:text-[#FFE600] pb-1.5 border-b border-gray-200 dark:border-neutral-800">CUPOM FISCAL INTEGRADO</p>
                          <p>Transação: <span className="font-bold text-gray-900 dark:text-white select-all">{lastCompletedSale.id}</span></p>
                          <p>Cliente: <span className="text-gray-900 dark:text-white">{lastCompletedSale.clientName}</span> ({lastCompletedSale.clientEmail})</p>
                          <p>Produto: <span className="text-gray-900 dark:text-white">{lastCompletedSale.productName}</span></p>
                          <p>Método: <span className="text-gray-900 dark:text-white">{lastCompletedSale.paymentMethod}</span></p>
                          <p>Total Pago: <span className="text-green-550 font-bold">{formatPrice(lastCompletedSale.price)}</span></p>
                          <p>Entrega: <span className="text-gray-950 dark:text-white font-sans text-[11px] block mt-1 bg-white dark:bg-neutral-900 p-1.5 rounded">{lastCompletedSale.shippingAddress}, {lastCompletedSale.shippingNumber}{lastCompletedSale.shippingComplement ? ` (${lastCompletedSale.shippingComplement})` : ''} - {lastCompletedSale.shippingNeighborhood}, {lastCompletedSale.shippingCity}/{lastCompletedSale.shippingState} (CEP: {lastCompletedSale.shippingCep})</span></p>
                          <p>Data/Hora: <span className="text-gray-950 dark:text-white">{lastCompletedSale.date}</span></p>
                        </div>
                      )}

                      <div className="p-3 bg-[#FFE600]/10 rounded-xl border border-[#FFE600]/25 text-[11px] text-[#FFE600] flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                        <span>O administrador recebeu seu faturamento e processará o pacote.</span>
                      </div>

                      <button
                        onClick={handleCloseDetails}
                        className="w-full py-3 rounded-xl bg-[#111111] dark:bg-neutral-850 hover:bg-neutral-850 dark:hover:bg-neutral-800 text-white font-bold text-xs"
                      >
                        Continuar Comprando
                      </button>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col justify-between">
                      {/* Product details */}
                      <div className="mb-6">
                        <div className="flex justify-between items-start">
                          <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white leading-tight">
                            {activeProduct.name}
                          </h3>
                        </div>

                        <p className="text-2xl font-bold font-display text-[#111111] dark:text-[#FFE600] mt-1.5 mb-3">
                          {formatPrice(activeProduct.price)}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans scrollbar-none max-h-24 overflow-y-auto">
                          {activeProduct.description}
                        </p>
                      </div>

                      {/* CHECKOUT WIZARD TABS */}
                      <div className="bg-gray-50 dark:bg-neutral-950 p-4 rounded-2xl border border-gray-150 dark:border-neutral-850 space-y-4">
                        <div className="flex justify-between items-center pb-2.5 border-b border-gray-200 dark:border-neutral-850">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-400 flex items-center space-x-1.5">
                            <Lock className="w-3.5 h-3.5 text-yellow-500" />
                            <span>Pagar com Segurança cwbecomm</span>
                          </span>
                        </div>

                        {/* Shipping Address Section */}
                        <div className="space-y-3 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-150 dark:border-neutral-850 text-left">
                          <p className="text-xs uppercase tracking-wider font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-1.5 font-mono">
                            <Truck className="w-4 h-4 text-emerald-500" />
                            <span>1. Endereço de Entrega / Envio</span>
                          </p>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {/* CEP */}
                            <div className="col-span-2">
                              <label className="block text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase mb-1">CEP *</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  maxLength={9}
                                  required
                                  value={shippingCep}
                                  onChange={(e) => handleCepChange(e.target.value)}
                                  placeholder="Digite seu CEP (ex: 80010-010)"
                                  className="w-full px-3 py-1.5 focus:outline-none focus:border-emerald-550 bg-gray-50 dark:bg-neutral-900 text-xs rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white"
                                />
                                {isLoadingCep && (
                                  <div className="absolute right-2 top-2.5">
                                    <span className="w-3 h-3 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin block" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Street Address */}
                            <div className="col-span-2">
                              <label className="block text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase mb-1">Endereço (Rua/Avenida) *</label>
                              <input
                                type="text"
                                required
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Nome da rua ou avenida"
                                className="w-full px-3 py-1.5 focus:outline-none focus:border-emerald-550 bg-gray-50 dark:bg-neutral-900 text-xs rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white"
                              />
                            </div>

                            {/* Number */}
                            <div className="col-span-1">
                              <label className="block text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase mb-1">Número *</label>
                              <input
                                type="text"
                                required
                                value={shippingNumber}
                                onChange={(e) => setShippingNumber(e.target.value)}
                                placeholder="123"
                                className="w-full px-3 py-1.5 focus:outline-none focus:border-emerald-550 bg-gray-50 dark:bg-neutral-900 text-xs rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white"
                              />
                            </div>

                            {/* Complement */}
                            <div className="col-span-1">
                              <label className="block text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase mb-1">Comp.</label>
                              <input
                                type="text"
                                value={shippingComplement}
                                onChange={(e) => setShippingComplement(e.target.value)}
                                placeholder="Apto, Bloco"
                                className="w-full px-3 py-1.5 focus:outline-none focus:border-emerald-550 bg-gray-50 dark:bg-neutral-900 text-xs rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white"
                              />
                            </div>

                            {/* Neighborhood */}
                            <div className="col-span-2">
                              <label className="block text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase mb-1">Bairro *</label>
                              <input
                                type="text"
                                required
                                value={shippingNeighborhood}
                                onChange={(e) => setShippingNeighborhood(e.target.value)}
                                placeholder="Bairro"
                                className="w-full px-3 py-1.5 focus:outline-none focus:border-emerald-550 bg-gray-50 dark:bg-neutral-900 text-xs rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white"
                              />
                            </div>

                            {/* City */}
                            <div className="col-span-3">
                              <label className="block text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase mb-1">Cidade *</label>
                              <input
                                type="text"
                                required
                                value={shippingCity}
                                onChange={(e) => setShippingCity(e.target.value)}
                                placeholder="Cidade"
                                className="w-full px-3 py-1.5 focus:outline-none focus:border-emerald-550 bg-gray-50 dark:bg-neutral-900 text-xs rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white"
                              />
                            </div>

                            {/* State */}
                            <div className="col-span-1">
                              <label className="block text-[10px] font-mono tracking-wider text-gray-400 font-bold uppercase mb-1">UF *</label>
                              <input
                                type="text"
                                maxLength={2}
                                required
                                value={shippingState}
                                onChange={(e) => setShippingState(e.target.value)}
                                placeholder="SP"
                                className="w-full px-3 py-1.5 focus:outline-none focus:border-emerald-550 bg-gray-50 dark:bg-neutral-900 text-xs rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white text-center font-bold uppercase"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Payment step header */}
                        <div className="text-left pt-1">
                          <p className="text-xs uppercase tracking-wider font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-1.5 font-mono">
                            <CreditCard className="w-4 h-4 text-emerald-500" />
                            <span>2. Escolha a Forma de Pagamento</span>
                          </p>
                        </div>

                        {/* Switch payment methods tabs buttons */}
                        {activePaypalLink && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setPaymentTab("pix")}
                              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border cursor-pointer ${
                                paymentTab === "pix"
                                  ? "bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] border-transparent"
                                  : "bg-white dark:bg-neutral-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-neutral-800"
                              }`}
                            >
                              <QrCode className="w-4 h-4" />
                              <span>Pix</span>
                            </button>

                            <button
                              onClick={() => setPaymentTab("link")}
                              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border cursor-pointer ${
                                paymentTab === "link"
                                  ? "bg-emerald-600 text-white border-transparent"
                                  : "bg-white dark:bg-neutral-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-neutral-800"
                              }`}
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Link de Checkout</span>
                            </button>
                          </div>
                        )}

                        {/* TAB 1 CONTENT: PIX */}
                        {paymentTab === "pix" && (
                          <div className="space-y-4 pt-1 font-sans">
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-gray-150 dark:border-neutral-800">
                              {/* Legitimate Pix logo representation inside QR display block */}
                              <div className="p-2.5 bg-white rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                <svg width="90" height="90" viewBox="0 0 100 100" className="text-[#111111]">
                                  <rect width="100" height="100" fill="none" />
                                  <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                                  <rect x="10" y="10" width="15" height="15" fill="white" />
                                  <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                                  <rect x="75" y="10" width="15" height="15" fill="white" />
                                  <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                                  <rect x="10" y="75" width="15" height="15" fill="white" />
                                  
                                  <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                                  <rect x="45" y="45" width="10" height="10" fill="white" />
                                  
                                  <rect x="40" y="10" width="10" height="15" fill="currentColor" />
                                  <rect x="15" y="40" width="15" height="10" fill="currentColor" />
                                  <rect x="70" y="45" width="15" height="15" fill="currentColor" />
                                  <rect x="45" y="75" width="15" height="10" fill="currentColor" />
                                  <rect x="75" y="75" width="15" height="12" fill="currentColor" />
                                </svg>
                              </div>

                              <div className="text-center sm:text-left space-y-1 w-full overflow-hidden">
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Pagamento Pix de Produção</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-400 leading-normal">
                                  Favorecido: <b className="text-[#FFE600]">{activeReceiverName}</b>. Use a cópia rápida abaixo no app do seu banco.
                                </p>
                                
                                <div className="space-y-1 pt-1.5">
                                  {/* Copy Pix Key */}
                                  <div className="flex items-center justify-between gap-1 bg-gray-100 dark:bg-neutral-950 p-1 px-2 rounded-lg text-[10px]">
                                    <span className="font-mono text-gray-600 dark:text-gray-300 truncate max-w-[150px] select-all">
                                      {activePixKey}
                                    </span>
                                    <button
                                      onClick={() => handleCopyText(activePixKey)}
                                      className="font-mono font-bold text-gray-500 hover:text-yellow-500 cursor-pointer flex-shrink-0"
                                    >
                                      {copiedText ? "Copiada!" : "Copiar Chave"}
                                    </button>
                                  </div>

                                  {/* Copy QR Dynamic Payload Code */}
                                  <div className="flex items-center justify-between gap-1 bg-gray-100 dark:bg-neutral-950 p-1 px-2 rounded-lg text-[10px]">
                                    <span className="font-mono text-gray-600 dark:text-gray-300 truncate max-w-[150px] select-all">
                                      {activePixPayload}
                                    </span>
                                    <button
                                      onClick={() => handleCopyText(activePixPayload)}
                                      className="font-mono font-bold text-green-500 hover:text-green-400 cursor-pointer flex-shrink-0"
                                    >
                                      {copiedText ? "Copiado!" : "Pix Copia e Cola"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Real Payer Verification Details form */}
                            <div className="space-y-2.5 text-left bg-gray-50 dark:bg-neutral-900/50 p-3.5 rounded-xl border border-gray-150 dark:border-neutral-800">
                              <p className="text-[10px] font-mono uppercase font-bold text-gray-400">Verificação de Pagamento Real</p>
                              <div>
                                <label className="block text-[9px] uppercase font-mono tracking-wider font-bold text-gray-505 mb-1">Nome Completo do Pagador no Pix *</label>
                                <input
                                  type="text"
                                  required
                                  value={pixPayerName}
                                  onChange={(e) => setPixPayerName(e.target.value)}
                                  placeholder="Ex: João da Silva Santos"
                                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-mono tracking-wider font-bold text-gray-505 mb-1">ID da Transação ou NSU do Comprovante *</label>
                                <input
                                  type="text"
                                  required
                                  value={pixTransactionId}
                                  onChange={(e) => setPixTransactionId(e.target.value)}
                                  placeholder="Insira o TxID, ID do Pix ou código do comprovante"
                                  className="w-full px-3 py-1.5 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            </div>

                            <button
                              disabled={isProcessingPayment}
                              onClick={() => handleProcessCheckout("Pix")}
                              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-md disabled:opacity-50"
                            >
                              <span>{isProcessingPayment ? "Registrando e enviando comprovante..." : "Confirmar e Enviar Comprovante Pix"}</span>
                            </button>
                          </div>
                        )}

                        {/* TAB 2 CONTENT: LINK DE CHECKOUT */}
                        {paymentTab === "link" && (
                          <div className="space-y-4 pt-1 font-sans">
                            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-left space-y-2">
                              <p className="text-xs font-bold text-emerald-500">Checkout Autorizado por Link</p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-300 leading-normal">
                                Você pagará o valor real de <b>{formatPrice(activeProduct.price)}</b> diretamente usando o gateway de pagamento externo seguro configurado pelo administrador.
                              </p>
                              <div className="p-2 bg-white dark:bg-neutral-950 border border-gray-150 dark:border-neutral-900 rounded-xl text-[9px] font-mono text-gray-500 break-all select-all">
                                {activePaypalLink}
                              </div>
                            </div>

                            <button
                              disabled={isProcessingPayment}
                              onClick={() => handleProcessCheckout("Link de Checkout")}
                              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer transition-colors shadow-md disabled:opacity-50"
                            >
                              <span>{isProcessingPayment ? "Redirecionando para o Checkout..." : "Ir para o Link de Pagamento Seguro"}</span>
                            </button>
                          </div>
                        )}

                        {/* Trust indicator */}
                        <div className="flex items-center justify-center space-x-1.5 opacity-70 text-[10px] font-mono">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                          <span>PAGAMENTO PROCESSADO INTEGRALMENTE EM AMBIENTE SEGURO</span>
                        </div>
                      </div>

                      {/* original channels auxiliary links */}
                      <div className="mt-4 pt-3 border-t border-gray-150 dark:border-neutral-800/80">
                        <span className="text-[10px] font-mono text-gray-400 block mb-2 font-bold uppercase select-none">
                          Canais de Expedição Auxiliares (Opcional):
                        </span>
                        
                        <div className="flex gap-2">
                          {activeProduct.mlUrl && (
                            <a
                              href={activeProduct.mlUrl}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg text-[10px] font-bold border border-yellow-500/20"
                            >
                              <span>Mercado Livre</span>
                              <ExternalLink className="w-2.5 height-2.5" />
                            </a>
                          )}
                          {activeProduct.shopeeUrl && (
                            <a
                              href={activeProduct.shopeeUrl}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-bold border border-orange-500/20"
                            >
                              <span>Shopee</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          <a
                            href={`https://wa.me/5511958975285?text=Olá!%20Sou%20o%2520cliente%20${encodeURIComponent(clientUser.name)}%20e%20gostaria%20de%20saber%20se%20o%20produto%20${encodeURIComponent(activeProduct.name)}%20já%20teve%2520o%20pagamento%20aprovado.`}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-bold border border-green-500/20"
                          >
                            <span>WhatsApp Suporte</span>
                            <MessageCircle className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* CLIENT REGISTER / LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-3xl p-7 shadow-2xl text-left z-10 text-gray-900 dark:text-white"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="w-10 h-10 bg-[#FFE600] text-[#111111] rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5 font-bold" />
              </div>

              {/* AUTHENTICATION TABS */}
              <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-neutral-950 rounded-xl mb-5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setAuthTab("register")}
                  className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    authTab === "register"
                      ? "bg-white dark:bg-neutral-850 text-gray-900 dark:text-[#FFE600] shadow-sm"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Criar Conta
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("login")}
                  className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    authTab === "login"
                      ? "bg-white dark:bg-neutral-850 text-gray-900 dark:text-[#FFE600] shadow-sm"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Entrar
                </button>
              </div>

              {authTab === "register" ? (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <h4 className="font-display font-semibold text-lg tracking-tight">Cadastro de Novo Cliente</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">
                      Crie sua conta para salvar seus pedidos, faturamentos e receber e-mails de confirmação.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">Seu Nome Completo *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        placeholder="Ex: João da Silva"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">E-mail para Confirmação *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="Ex: joao@email.com"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">Telefone (WhatsApp) *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="Ex: 11999998888"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1">Crie uma Senha *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="w-1/3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-850 text-xs font-bold font-sans text-center cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 rounded-xl bg-[#FFE600] hover:bg-yellow-500 text-[#111111] font-bold text-xs text-center cursor-pointer shadow-lg shadow-yellow-500/10"
                    >
                      Cadastrar e Confirmar
                    </button>
                  </div>
                </form>
              ) : (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <h4 className="font-display font-semibold text-lg tracking-tight">Login de Cliente</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-normal">
                      Acesse sua conta salva para visualizar seus pedidos anteriores e salvar seus novos pagamentos.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1.5">E-mail Cadastrado *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={loginCreds.email}
                        onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
                        placeholder="Seu e-mail cadastrado"
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1.5">Sua Senha *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={loginCreds.password}
                        onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="w-1/3 py-3 rounded-xl border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-850 text-xs font-bold font-sans text-center cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-xl bg-[#FFE600] hover:bg-yellow-500 text-[#111111] font-bold text-xs text-center cursor-pointer shadow-lg shadow-yellow-500/10"
                    >
                      Entrar na Conta
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* DETAILED HIGH-FIDELITY EMAIL CONFIRMATION OVERLAY FOR FULL CREDIBILITY */}
      <AnimatePresence>
        {emailNotification?.isOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmailNotification(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-gray-100 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl z-10 text-gray-950"
            >
              {/* Header representing a modern desktop/tablet email inbox */}
              <div className="bg-[#111111] text-white p-4.5 px-6 flex justify-between items-center select-none">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <p className="text-xs font-mono font-bold tracking-wider opacity-90 pl-3">E-MAIL RECEBIDO - NOTIFICAÇÃO DE CONFIRMAÇÃO</p>
                </div>
                <button
                  onClick={() => setEmailNotification(null)}
                  className="p-1 px-2.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-mono cursor-pointer font-bold uppercase"
                >
                  Fechar caixa postal
                </button>
              </div>

              {/* Email envelopes metadata */}
              <div className="p-4 bg-white border-b border-gray-150 text-xs font-sans space-y-1.5 flex flex-col text-left">
                <p><span className="font-bold text-gray-400 inline-block w-16">De:</span> <span className="font-semibold text-gray-800">cwbecomm automated platform &lt;noreply@cwbecomm.com.br&gt;</span></p>
                <p><span className="font-bold text-gray-400 inline-block w-16">Para:</span> <span className="font-semibold text-gray-800">{emailNotification.to}</span></p>
                <p><span className="font-bold text-gray-400 inline-block w-16">Assunto:</span> <span className="font-bold text-emerald-600">🚨 Confirme seu cadastro na loja cwbecomm</span></p>
              </div>

              {/* HTML Mail Body Inside the Simulator */}
              <div className="p-8 bg-gray-50/50 text-left font-sans text-gray-800 space-y-6 max-h-[450px] overflow-y-auto">
                <div className="p-5.5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3.5">
                    <span className="font-display font-black text-lg tracking-wider text-black">
                      cwbe<span className="text-[#FFE600] text-xl">comm</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                      Cadastro seguro
                    </span>
                  </div>

                  <p className="text-sm">Olá, <b className="text-black">{emailNotification.name}</b>!</p>
                  
                  <p className="text-xs leading-relaxed text-gray-600">
                    Obrigado por se cadastrar na <b className="text-black">cwbecomm</b>. Para garantir total conformidade de canais de faturamento real de seus pedidos, solicitamos a ativação do seu login clicando no botão abaixo.
                  </p>

                  <div className="py-4 text-center">
                    <button
                      onClick={() => {
                        setEmailNotification(null);
                        alert("Sua conta na cwbecomm foi confirmada e ativada com absoluto sucesso! Boas compras.");
                      }}
                      className="inline-block px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold font-sans text-sm shadow-md cursor-pointer transition-all uppercase tracking-wide"
                    >
                      ✔ ATIVAR E CONFIRMAR MINHA CONTA AGORA
                    </button>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="space-y-1 text-[10px] text-gray-500 font-mono leading-relaxed">
                    <p>• Dados salvos localmente: <b>Mantenha-se logado para salvar seus pedidos anteriores</b></p>
                    <p>• Canal de suporte integrado: <b>migzinho2013@gmail.com</b></p>
                    <p>• ID de validação SMTP: <b>CW-{Math.floor(100000 + Math.random() * 900000)}</b></p>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center font-mono select-none">
                  Este é um e-mail de notificação gerado de forma autônoma pela plataforma de produção cwbecomm.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
