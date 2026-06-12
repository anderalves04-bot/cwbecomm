import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  User,
  Key,
  Database,
  Plus,
  Trash2,
  Edit3,
  LogOut,
  FolderOpen,
  Upload,
  Coins,
  MessageSquare,
  AlertTriangle,
  Layers,
  Sparkles,
  CheckCircle,
  Clock,
  ExternalLink,
  X,
  FileText,
  BadgeDollarSign,
  Settings
} from "lucide-react";
import { Product, ContactData, Sale } from "../types";
import { CATEGORIES } from "../data/initialProducts";

// SECURE ADMIN PASSWORD CONFIGURATION
const ADMIN_USER = "admin";
const ADMIN_PASS = "cwecomm2004"; // As requested by client

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onLogoutToHome: () => void;
}

export default function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogoutToHome,
}: AdminPanelProps) {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Views / Tabs state
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "messages" | "faturamento" | "config">("dashboard");

  // Real payment system configuration states
  const [pixKey, setPixKey] = useState("");
  const [paypalLink, setPaypalLink] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [pixStaticCode, setPixStaticCode] = useState("");

  // Product Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isPdfFile, setIsPdfFile] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Eletrônicos");
  const [mlUrl, setMlUrl] = useState("");
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  // Lists persistence states
  const [contacts, setContacts] = useState<(ContactData & { id: string; date: string })[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Check login persists & warm initial states
  useEffect(() => {
    const checkLogin = sessionStorage.getItem("admin_logged_in");
    if (checkLogin === "true") {
      setIsLoggedIn(true);
    }
    loadSubmissions();
    loadSalesHistory();

    const savedPixKey = localStorage.getItem("cwbecomm_pix_key") || "+5511958975285";
    const savedPaypalLink = localStorage.getItem("cwbecomm_paypal_link") || "";
    const savedReceiver = localStorage.getItem("cwbecomm_receiver_name") || "Miguel Pires Alves";
    const savedPixStaticCode = localStorage.getItem("cwbecomm_pix_static_code") || "00020126360014BR.GOV.BCB.PIX0114+55119589752855204000053039865802BR5918Miguel Pires Alves6009SAO PAULO62140510SAdMs0EOzA6304B403";

    setPixKey(savedPixKey);
    setPaypalLink(savedPaypalLink);
    setReceiverName(savedReceiver);
    setPixStaticCode(savedPixStaticCode);
  }, []);

  const loadSubmissions = () => {
    const subs = JSON.parse(localStorage.getItem("contact_submissions") || "[]");
    setContacts(subs);
  };

  const loadSalesHistory = () => {
    // Perform a one-time force reset of starting sales to meet the user request for zeroed records
    const didReset = localStorage.getItem("cwbecomm_sales_reset_v3");
    if (!didReset) {
      localStorage.setItem("cwbecomm_sales", "[]");
      localStorage.setItem("cwbecomm_sales_reset_v3", "true");
      setSales([]);
      return;
    }

    const storedSales = localStorage.getItem("cwbecomm_sales");
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    } else {
      localStorage.setItem("cwbecomm_sales", "[]");
      setSales([]);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setLoginError("");
      sessionStorage.setItem("admin_logged_in", "true");
    } else {
      setLoginError("Credenciais inválidas. Dica: Usuário 'admin' e senha alterada!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_logged_in");
    onLogoutToHome();
  };

  // Convert uploaded image to Base64 and handle PDF images gracefully
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      
      // Determine if file is PDF
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setIsPdfFile(true);
        // Set a stylish default PDF cover representing a PDF catalog in cwbecomm
        const dummyPdfUri = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231E1E1E'/><rect x='10' y='10' width='380' height='280' fill='none' stroke='%23FF0000' stroke-width='2' stroke-dasharray='4'/><text x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%23FF4444'>CATÁLOGO COMERCIAL PDF</text><text x='50%25' y='60%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='12' fill='%23CCCCCC'>" + encodeURIComponent(file.name) + "</text></svg>";
        setImagePreview(dummyPdfUri);
        alert(`Arquivo PDF '${file.name}' detectado com sucesso! O produto exibirá uma badge de catálogo digital.`);
      } else {
        setIsPdfFile(false);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImagePreview(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Open Form to ADD product
  const handleOpenAddForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Eletrônicos");
    setMlUrl("");
    setShopeeUrl("");
    setFeatured(false);
    setImagePreview("https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600"); 
    setUploadedFileName("");
    setIsPdfFile(false);
    setIsFormOpen(true);
  };

  // Open Form to EDIT product
  const handleOpenEditForm = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setCategory(prod.category);
    setMlUrl(prod.mlUrl || "");
    setShopeeUrl(prod.shopeeUrl || "");
    setFeatured(!!prod.featured);
    setImagePreview(prod.image);
    setUploadedFileName(prod.image.includes("SVG") ? "Catálogo_Antigo.pdf" : "Imagem_Anterior.png");
    setIsPdfFile(prod.image.includes("data:image/svg") || prod.image.includes("PDF"));
    setIsFormOpen(true);
  };

  // Submit Add or Edit Product Form
  const handleSubmitProduct = (e: FormEvent) => {
    e.preventDefault();

    if (!name || !price || !description || !imagePreview) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Por favor insira um preço numérico válido e maior que zero.");
      return;
    }

    // Direct prefilled WhatsApp link based on details
    const cleanNum = "11958975285";
    const whatsappUrl = `https://wa.me/55${cleanNum}?text=Olá!%20Tenho%20interesse%20no%20produto%20${encodeURIComponent(name)}.%20Ainda%20está%20disponível?`;

    if (editingId) {
      const updatedProduct: Product = {
        id: editingId,
        name,
        description,
        price: priceNum,
        category,
        image: imagePreview,
        mlUrl: mlUrl || undefined,
        shopeeUrl: shopeeUrl || undefined,
        whatsappUrl,
        featured,
      };
      onUpdateProduct(updatedProduct);
    } else {
      const newProduct: Product = {
        id: "prod-" + Date.now().toString(),
        name,
        description,
        price: priceNum,
        category,
        image: imagePreview,
        mlUrl: mlUrl || undefined,
        shopeeUrl: shopeeUrl || undefined,
        whatsappUrl,
        featured,
      };
      onAddProduct(newProduct);
    }

    setIsFormOpen(false);
    alert(editingId ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!");
  };

  // Clear contact messages
  const handleClearMessages = () => {
    if (confirm("Deseja realmente limpar todos os contatos recebidos?")) {
      localStorage.removeItem("contact_submissions");
      setContacts([]);
    }
  };

  // Clear Sales History
  const handleClearSalesHistory = () => {
    if (confirm("Gostaria de zerar o histórico de faturamento para começar os registros do zero?")) {
      localStorage.setItem("cwbecomm_sales", "[]");
      setSales([]);
    }
  };

  const handleSavePaymentConfig = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cwbecomm_pix_key", pixKey);
    localStorage.setItem("cwbecomm_paypal_link", paypalLink);
    localStorage.setItem("cwbecomm_receiver_name", receiverName);
    localStorage.setItem("cwbecomm_pix_static_code", pixStaticCode);
    alert("Configurações de pagamento atualizadas com sucesso! Os clientes pagarão diretamente usando os dados reais de Pix ou o Link/ID de Checkout configurados.");
  };

  // Faturamento totals calculations
  const totalRevenue = sales.reduce((sum, item) => sum + item.price, 0);

  // Login view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111] px-4 py-16 text-white font-sans">
        <div className="absolute inset-x-0 top-0 h-40 bg-[#FFE600]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative"
        >
          {/* Lock icon badge */}
          <div className="w-14 h-14 bg-[#FFE600] text-[#111111] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/10">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold">cwbecomm Admin</h2>
            <p className="text-xs text-gray-400 mt-1">Painel administrativo oficial da marca</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div>
              <label className="block text-[10.5px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-2">
                Usuário do Administrador
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <User className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-[#FFE600] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-2">
                Senha Segura
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Key className="w-4.5 h-4.5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insira a nova senha segura..."
                  className="w-full pl-11 pr-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-[#FFE600] transition-colors text-sm"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center space-x-2 p-3 bg-red-400/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}



            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onLogoutToHome}
                className="w-1/2 p-3.5 rounded-xl border border-white/15 hover:bg-white/5 font-semibold text-sm transition-colors cursor-pointer text-center"
              >
                Voltar à Loja
              </button>

              <button
                type="submit"
                className="w-1/2 p-3.5 rounded-xl bg-[#FFE600] text-[#111111] font-bold text-sm hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-500/10 cursor-pointer"
              >
                Acessar Painel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="admin-workspace-layout" className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white pt-24 pb-16 font-sans transition-colors duration-300 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Upper Bar Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-[#111111] text-white rounded-3xl border border-white/5 mb-10 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 bg-[#FFE600] text-[#111111] rounded-2xl flex items-center justify-center font-bold shadow-md">
              <Database className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-medium">cwbecomm Workspace</h1>
              <p className="text-[10px] uppercase font-mono text-[#FFE600] tracking-wider font-bold">Painel de Controle Corporativo</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/10 font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span>Conexão Segura</span>
            </span>

            <button
              id="admin-logout-trigger"
              onClick={handleLogout}
              className="flex items-center space-x-1.5 p-2 px-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all ml-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Workspace Tabs Section */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-neutral-800 mb-8 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] shadow-md"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("faturamento")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "faturamento"
                ? "bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] shadow-md"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900"
            }`}
          >
            <BadgeDollarSign className="w-4 h-4" />
            <span>Faturamento ({sales.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "products"
                ? "bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] shadow-md"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Produtos ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("messages");
              loadSubmissions();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "messages"
                ? "bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] shadow-md"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contatos ({contacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "config"
                ? "bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] shadow-md"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações IPG</span>
          </button>
        </div>

        {/* TAB WORKSPACE */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SUMMARY DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Cards row with Faturamento highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-[10.5px] uppercase font-mono tracking-wider text-gray-500">Faturamento Real</p>
                    <span className="p-2 rounded-lg bg-green-500/10 text-green-500"><Coins className="w-5 h-5" /></span>
                  </div>
                  <p className="text-3xl font-display font-bold text-[#111111] dark:text-green-400 mt-4">
                    R$ {totalRevenue.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-[10.5px] uppercase font-mono tracking-wider text-gray-500">Vendas Confirmadas</p>
                    <span className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><BadgeDollarSign className="w-5 h-5" /></span>
                  </div>
                  <p className="text-3xl font-display font-bold text-[#111111] dark:text-white mt-4">{sales.length}</p>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-[10.5px] uppercase font-mono tracking-wider text-gray-500">Produtos Ativos</p>
                    <span className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><FolderOpen className="w-5 h-5" /></span>
                  </div>
                  <p className="text-3xl font-display font-bold text-[#111111] dark:text-white mt-4">{products.length}</p>
                </div>

                <div className="bg-white dark:bg-[#111111] text-gray-900 dark:text-white p-6 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-[10.5px] uppercase font-mono tracking-wider text-gray-400">Preço Médio</p>
                    <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Sparkles className="w-5 h-5" /></span>
                  </div>
                  <p className="text-3xl font-display font-bold mt-4">
                    R${" "}
                    {(
                      products.reduce((acc, p) => acc + p.price, 0) /
                      (products.length || 1)
                    ).toFixed(2)}
                  </p>
                </div>

              </div>

              {/* Transactions actions box split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Sales List */}
                <div className="lg:col-span-8 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                      Últimos Pedidos Confirmados (Vendas Reais)
                    </h3>
                  </div>
                  
                  {sales.length === 0 ? (
                    <div className="text-center py-10 font-medium text-gray-400 text-sm">
                      Nenhuma venda registrada ainda no faturamento.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400 border-collapse">
                        <thead>
                          <tr className="border-b border-gray-150 dark:border-neutral-800 pb-3 font-mono text-[10px] uppercase font-bold text-gray-400">
                            <th className="pb-3">Data</th>
                            <th className="pb-3">Cliente</th>
                            <th className="pb-3">Pagamento</th>
                            <th className="pb-3">Produto</th>
                            <th className="pb-3 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sales.slice(-5).reverse().map((sale) => (
                            <tr key={sale.id} className="border-b border-gray-100 dark:border-neutral-800/50 hover:bg-gray-50 dark:hover:bg-neutral-850/30 transition-colors">
                              <td className="py-3 pr-2 font-mono whitespace-nowrap">{sale.date}</td>
                              <td className="py-3 font-semibold text-gray-900 dark:text-white">
                                {sale.clientName} <br />
                                <span className="text-[10px] text-gray-400 font-normal">{sale.clientEmail}</span>
                                {sale.pixPayerName && (
                                  <div className="mt-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 px-1.5 rounded font-normal space-y-0.5">
                                    <p><b>Favorecido:</b> {sale.pixPayerName}</p>
                                    <p className="break-all font-mono"><b>ID Pix:</b> {sale.pixTransactionId}</p>
                                  </div>
                                )}
                                {sale.shippingCep && (
                                  <div className="mt-1 text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 p-1 px-1.5 rounded font-normal space-y-0.5 max-w-xs">
                                    <p className="font-bold uppercase text-[8px] text-blue-500 tracking-wider">Endereço de Envio</p>
                                    <p><b>CEP:</b> {sale.shippingCep}</p>
                                    <p><b>Rua:</b> {sale.shippingAddress}, nº {sale.shippingNumber}{sale.shippingComplement ? ` (${sale.shippingComplement})` : ""}</p>
                                    <p><b>Bairro:</b> {sale.shippingNeighborhood}</p>
                                    <p><b>Cidade:</b> {sale.shippingCity} - {sale.shippingState}</p>
                                  </div>
                                )}
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  sale.paymentMethod === "Pix" ? "bg-green-500/10 text-green-500" :
                                  sale.paymentMethod === "Cartão" ? "bg-blue-500/10 text-blue-500" :
                                  "bg-orange-500/10 text-orange-500"
                                }`}>
                                  {sale.paymentMethod}
                                </span>
                              </td>
                              <td className="py-3 text-gray-600 dark:text-gray-300 max-w-[150px] truncate">{sale.productName}</td>
                              <td className="py-3 text-right text-gray-950 dark:text-white font-bold font-mono">R$ {sale.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Info channel support box */}
                <div className="lg:col-span-4 bg-[#FFE600]/10 border border-[#FFE600]/25 p-6 rounded-2xl text-[#111111] dark:text-[#FFE600] space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <h4 className="font-display font-bold text-base">Controle Corporativo cwbecomm</h4>
                  </div>
                  <p className="text-xs text-gray-800 dark:text-gray-300 leading-relaxed font-sans">
                    Qualquer produto editado ou cadastrado fica imediatamente ativo no catálogo do cliente. Conforme os clientes efetuam checkouts via Pix ou Checkout Direto de produção, o faturamento do painel é atualizado em tempo real com segurança total.
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setActiveTab("faturamento")}
                      className="text-xs font-semibold bg-[#111111] text-white p-2.5 rounded-lg w-full text-center block tracking-wide hover:bg-neutral-800 cursor-pointer"
                    >
                      Auditoria de Vendas
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB: AUDIT FATURAMENTO */}
          {activeTab === "faturamento" && (
            <motion.div
              key="tab-faturamento"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 px-5 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-500 font-mono block">Faturamento da Loja cwbecomm</span>
                  <span className="text-2xl font-bold font-sans text-green-550">R$ {totalRevenue.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                  {sales.length > 0 && (
                    <button
                      onClick={handleClearSalesHistory}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all cursor-pointer border border-transparent"
                    >
                      Zerar Faturamento
                    </button>
                  )}
                </div>
              </div>

              {sales.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-150 dark:border-neutral-800">
                  <Coins className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="font-medium text-gray-400">Nenhum faturamento registrado.</p>
                  <p className="text-xs text-gray-400/80 mt-1">Os pedidos de clientes reais aparecerão listados aqui.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400 border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 pb-3 font-mono text-[10px] uppercase font-bold text-gray-400">
                          <th className="p-4 px-6">ID Pedido / Data</th>
                          <th className="p-4">Cliente</th>
                          <th className="p-4">Produto Adquirido</th>
                          <th className="p-4">Canal/Meio</th>
                          <th className="p-4 text-right">Valor bruto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100 dark:border-neutral-800/65 hover:bg-gray-50 dark:hover:bg-neutral-850/30 transition-colors">
                            <td className="p-4 px-6 font-mono">
                              <span className="font-bold text-gray-900 dark:text-white block">{item.id}</span>
                              <span className="text-[10px] text-gray-400">{item.date}</span>
                            </td>
                            <td className="p-4 font-semibold text-gray-900 dark:text-white">
                              {item.clientName} <br />
                              <span className="text-[10px] text-gray-400 font-mono font-normal">{item.clientEmail}</span>
                              {item.pixPayerName && (
                                <div className="mt-1.5 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1.5 rounded font-normal space-y-0.5 max-w-xs">
                                  <p><b>Favorecido/Pagador:</b> {item.pixPayerName}</p>
                                  <p className="break-all font-mono text-[9px]"><b>ID Pix:</b> {item.pixTransactionId}</p>
                                </div>
                              )}
                              {item.shippingCep && (
                                <div className="mt-1.5 text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 p-1.5 rounded font-normal space-y-0.5 max-w-xs font-sans">
                                  <p className="font-bold uppercase text-[8px] text-blue-500 tracking-wider">Endereço de Envio</p>
                                  <p><b>CEP:</b> {item.shippingCep}</p>
                                  <p><b>Rua:</b> {item.shippingAddress}, nº {item.shippingNumber}{item.shippingComplement ? ` (${item.shippingComplement})` : ""}</p>
                                  <p><b>Bairro:</b> {item.shippingNeighborhood}</p>
                                  <p><b>Cidade:</b> {item.shippingCity}/{item.shippingState}</p>
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-gray-600 dark:text-gray-300">
                              {item.productName}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.paymentMethod === "Pix" ? "bg-green-500/10 text-green-500" :
                                item.paymentMethod === "Cartão" ? "bg-blue-500/10 text-blue-500" :
                                "bg-orange-500/10 text-orange-400"
                              }`}>
                                {item.paymentMethod}
                              </span>
                            </td>
                            <td className="p-4 text-right font-bold text-gray-950 dark:text-green-400 font-mono text-sm leading-none">
                              R$ {item.price.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: PRODUCTS MANAGER LIST */}
          {activeTab === "products" && (
            <motion.div
              key="tab-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              
              {/* Product actions bar header */}
              <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 px-5 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm flex-wrap gap-2">
                <span className="text-xs font-semibold text-gray-500 font-mono">Listagem Completa</span>
                
                <button
                  id="admin-add-product-btn"
                  onClick={handleOpenAddForm}
                  className="flex items-center space-x-1.5 bg-[#FFE600] hover:bg-yellow-500 text-[#111111] text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-yellow-500/10 cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5 stroke-[3]" />
                  <span>Cadastrar Novo Produto</span>
                </button>
              </div>

              {/* List table */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400 border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 pb-3 font-mono text-[10px] uppercase font-bold text-gray-400">
                        <th className="p-4 px-6">Produto</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Mídia Fonte</th>
                        <th className="p-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => {
                        const hasPdfImage = prod.image && (prod.image.includes("data:image/svg") || prod.image.length < 1000);
                        return (
                          <tr key={prod.id} className="border-b border-gray-100 dark:border-neutral-800/65 hover:bg-gray-50 dark:hover:bg-neutral-850/30 transition-colors">
                            
                            <td className="p-4 px-6 font-sans">
                              <div className="flex items-center space-x-3 text-left">
                                {hasPdfImage ? (
                                  <div className="w-11 h-11 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0 text-red-500">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                ) : (
                                  <img
                                    src={prod.image || "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600"}
                                    alt={prod.name}
                                    referrerPolicy="no-referrer"
                                    className="w-11 h-11 rounded-lg object-cover bg-gray-100 dark:bg-neutral-950 flex-shrink-0"
                                  />
                                )}
                                <div>
                                  <span className="font-semibold text-gray-900 dark:text-white block line-clamp-1">{prod.name}</span>
                                  <span className="text-[10px] text-gray-400 font-mono block">ID: {prod.id}</span>
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 p-1 px-2.5 rounded-full text-[10.5px] font-mono leading-none">
                                {prod.category}
                              </span>
                            </td>

                            <td className="p-4 font-bold text-gray-950 dark:text-[#FFE600] font-sans text-sm">
                              R$ {prod.price.toFixed(2)}
                            </td>

                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {hasPdfImage ? (
                                  <span className="bg-red-500/15 text-red-500 p-1 px-2 rounded font-mono text-[9px] font-bold">PDF Brochrue</span>
                                ) : (
                                  <span className="bg-green-500/15 text-green-500 p-1 px-2 rounded font-mono text-[9px] font-bold">Imagem JPG/PNG</span>
                                )}
                              </div>
                            </td>

                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center space-x-1.5">
                                <button
                                  onClick={() => handleOpenEditForm(prod)}
                                  className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-[#FFE600]/20 text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-[#FFE600] transition-all cursor-pointer"
                                  title="Editar Produto"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Excluir permanentemente o produto "${prod.name}" do catálogo comercial cwbecomm?`)) {
                                      onDeleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-red-500/10 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all cursor-pointer"
                                  title="Excluir Produto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB: CONTACT FORM MESSAGE LOGS */}
          {activeTab === "messages" && (
            <motion.div
              key="tab-messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              
              <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-4 px-5 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm flex-wrap gap-2">
                <span className="text-xs font-semibold text-gray-500 font-mono">Todos os contatos recebidos ({contacts.length})</span>
                
                {contacts.length > 0 && (
                  <button
                    onClick={handleClearMessages}
                    className="flex items-center space-x-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-500 hover:text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Apagar Tudo</span>
                  </button>
                )}
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-150 dark:border-neutral-800">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="font-medium text-gray-400">Nenhum formulário de contato enviado ainda.</p>
                  <p className="text-xs text-gray-400/80 mt-1">Quando os clientes preencherem o formulário no site, as mensagens aparecerão aqui.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contacts.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-150 dark:border-neutral-800 shadow-sm text-left flex flex-col justify-between"
                    >
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start pb-2 border-b border-gray-100 dark:border-neutral-800">
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white text-sm block">{msg.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide block font-semibold">{msg.email}</span>
                          </div>
                          <span className="text-[10px] bg-gray-100 dark:bg-neutral-800 text-gray-500 font-mono p-1 px-2 rounded-full flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{msg.date}</span>
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 dark:bg-neutral-950 rounded-xl border border-gray-150 dark:border-neutral-800 text-xs text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                        <span className="text-[10.5px] text-gray-400 dark:text-gray-500 font-bold font-mono font-sans">TEL: {msg.phone || "Não cadastrado"}</span>
                        
                        {msg.phone && (
                          <a
                            href={`https://wa.me/55${msg.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="flex items-center space-x-1 hover:text-[#FFE600] font-semibold text-xs text-green-500"
                          >
                            <span>Iniciar conversa</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          )}

          {activeTab === "config" && (
            <motion.div
              key="tab-config"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 animate-fade-in"
            >
              <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-sm text-left">
                <div className="flex items-center space-x-3.5 pb-5 border-b border-gray-100 dark:border-neutral-800">
                  <div className="w-11 h-11 rounded-xl bg-[#FFE600] flex items-center justify-center text-neutral-900">
                    <Settings className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Configurações de Pagamento Integrado</h2>
                    <p className="text-xs text-gray-400">Insira suas chaves reais de recebimento. O Pix e o Link de Checkout se conectarão a estas chaves diretamente.</p>
                  </div>
                </div>

                <form onSubmit={handleSavePaymentConfig} className="space-y-6 mt-6 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Pix Key Field */}
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase font-mono tracking-wider text-gray-400 font-bold">Chave Pix Recebedora *</label>
                      <input
                        type="text"
                        required
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="Ex: CPF/CNPJ, Celular ou E-mail da chave Pix"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-950 text-gray-955 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-sm font-semibold"
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                        Insira a chave do destinatário para onde os clientes farão a transferência Pix. Ex: <i>comercial@cwbecomm.com.br</i>
                      </span>
                    </div>

                    {/* Receiver Name */}
                    <div className="space-y-2">
                      <label className="block text-[11px] uppercase font-mono tracking-wider text-gray-400 font-bold">Nome do Beneficiário *</label>
                      <input
                        type="text"
                        required
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="Ex: CWBECOMM LTDA"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-950 text-gray-955 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-sm font-semibold"
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                        Preencha com o nome do titular da chave Pix para correspondência e verificação segura.
                      </span>
                    </div>

                    {/* Checkout Link Field */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="block text-[11px] uppercase font-mono tracking-wider text-gray-400 font-bold">Link ou ID do Gateway de Checkout (Mercado Pago, Stripe, Kiwify, etc.)</label>
                      <input
                        type="text"
                        value={paypalLink}
                        onChange={(e) => setPaypalLink(e.target.value)}
                        placeholder="Ex: https://mpago.la/seu-checkout, link do Stripe, ou ID externo"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-950 text-gray-955 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-sm"
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                        Link de redirecionamento para o seu checkout de pagamento externo real. No momento do checkout por cartão ou link alternativo, o cliente será enviado para essa URL. Deixe em branco se desejar desativar essa opção para os clientes (eles só pagarão por Pix se for o único disponível).
                      </span>
                    </div>

                    {/* Pix Static Copy & Paste Code */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="block text-[11px] uppercase font-mono tracking-wider text-gray-400 font-bold">Código Pix Copia e Cola Estático (Opcional)</label>
                      <textarea
                        rows={3}
                        value={pixStaticCode}
                        onChange={(e) => setPixStaticCode(e.target.value)}
                        placeholder="Insira o seu código Pix Copia e Cola estático completo aqui (começando com 000201...). Se preenchido, os clientes copiarão exatamente este código fixo ao invés de usar a geração dinâmica."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-950 text-gray-955 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-xs font-mono"
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                        Perfeito se você possui um código PIX com valor livre ou quer canalizar todos os pagamentos para uma cobrança estática fixa pré-gerada no seu banco.
                      </span>
                    </div>
                  </div>

                  {/* Warning / Explanation banner */}
                  <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/15 text-xs text-yellow-300 flex items-start space-x-3 font-mono leading-relaxed">
                    <AlertTriangle className="w-5 h-5 text-[#FFE600] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase text-[#FFE600] mb-1">PRODUÇÃO REAL ATIVADA</p>
                      <p>Ao salvar essas novas chaves, as contas de destino do checkout Pix ou do Link/ID Externo do cliente são atualizadas em tempo real. Os QR Codes e códigos copia-e-cola gerados dinamicamente no checkout dos clientes herdarão e injetarão a sua chave Pix Real, e os pagamentos por checkout externo enviarão o usuário diretamente ao seu link para liquidação segura.</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="py-3 px-8 rounded-xl bg-[#FFE600] text-[#111111] hover:bg-yellow-500 font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-colors"
                    >
                      Salvar Dados de Produção
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* POPUP ACTION MODAL: ADD/EDIT PRODUCT */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-neutral-800 z-10 max-h-[85vh] flex flex-col text-left text-gray-900 dark:text-white"
            >
              {/* Form title bar */}
              <div className="p-4 px-6 border-b border-gray-150 bg-neutral-900 text-white flex justify-between items-center flex-shrink-0">
                <span className="font-display font-medium text-sm tracking-wide">
                  {editingId ? "Editar Produto cwbecomm" : "Cadastrar Novo Produto cwbecomm"}
                </span>
                
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form body scroll */}
              <form onSubmit={handleSubmitProduct} className="overflow-y-auto p-6 space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-1">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Fone Bluetooth Comfort Pro"
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-950 text-gray-950 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-1">
                      Preço de Venda (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 279.90"
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-950 text-gray-950 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                    />
                  </div>

                  {/* Category select */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-1">
                      Categoria Comercial *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-950 text-gray-950 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-xs font-semibold"
                    >
                      {CATEGORIES.filter((c) => c !== "Todos").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-1">
                    Descrição Detalhada do Produto *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva as especificações técnicas, vantagens e detalhes do envio."
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-950 text-gray-950 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-xs resize-none font-sans"
                  />
                </div>

                {/* Marketplace URLs links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-1">
                      URL Mercado Livre (Opcional)
                    </label>
                    <input
                      type="url"
                      value={mlUrl}
                      onChange={(e) => setMlUrl(e.target.value)}
                      placeholder="https://mercadolivre.com.br/..."
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-950 text-gray-950 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-1">
                      URL Shopee (Opcional)
                    </label>
                    <input
                      type="url"
                      value={shopeeUrl}
                      onChange={(e) => setShopeeUrl(e.target.value)}
                      placeholder="https://shopee.com.br/..."
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-950 text-gray-950 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] text-xs"
                    />
                  </div>
                </div>

                {/* Secure image & PDF upload module */}
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mb-1.5">
                    Upload de Imagem ou Catálogo em PDF *
                  </label>
                  
                  <div className="flex items-center space-x-4">
                    {/* Preview box */}
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                        {isPdfFile ? (
                          <FileText className="w-8 h-8 text-red-500" />
                        ) : (
                          <img
                            src={imagePreview}
                            alt="preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}

                    <div className="flex-grow">
                      <label className="flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 dark:border-neutral-800 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span>{uploadedFileName ? `Selecionado: ${uploadedFileName.slice(0, 15)}...` : "Carregar Imagem ou PDF"}</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium block mt-1">
                    Aceita imagens JPEG/PNG normais OU arquivos PDF. Arquivos PDF serão indexados automaticamente de forma digital.
                  </span>
                </div>

                {/* Switch for Featured items */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800">
                  <input
                    type="checkbox"
                    id="featured-toggle"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-gray-300 text-[#FFE600] focus:ring-[#FFE600]"
                  />
                  <label htmlFor="featured-toggle" className="text-xs font-bold text-gray-750 dark:text-gray-300 cursor-pointer">
                    Destacar produto? (aparece em evidência no topo do catálogo)
                  </label>
                </div>

                {/* Drawer submit footer actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="w-1/2 p-3 rounded-xl border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-850 font-semibold text-xs text-center cursor-pointer"
                  >
                    Descartar Alterações
                  </button>

                  <button
                    type="submit"
                    className="w-1/2 p-3 rounded-xl bg-[#111111] text-white hover:bg-neutral-850 font-bold text-xs text-center cursor-pointer shadow-lg"
                  >
                    Salvar Produto
                  </button>
                </div>

              </form>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
