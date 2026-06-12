import { motion } from "motion/react";
import { ShoppingCart, MessageCircle, ExternalLink, ArrowRight, ShieldCheck, Award } from "lucide-react";

interface HeroProps {
  onExploreProducts: () => void;
  whatsappNumber: string;
}

export default function Hero({ onExploreProducts, whatsappNumber }: HeroProps) {
  const whatsappUrl = `https://wa.me/55${whatsappNumber.replace(/\D/g, "")}?text=Olá!%20Estava%20vendo%20o%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20produtos.`;

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#111111] text-white"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFE600]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-pulse" />
              <span className="text-xs font-mono tracking-wider uppercase text-[#FFE600]">
                Canais de Venda Oficiais Ativos
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight leading-tight text-white"
            >
              Os melhores produtos com{" "}
              <span className="text-[#FFE600] font-black relative inline-block">
                segurança
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#FFE600]/20 -z-10" />
              </span>{" "}
              e{" "}
              <span className="text-[#FFE600] font-black relative inline-block">
                confiança.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed"
            >
              Descubra acessórios inteligentes e eletrônicos de alta tecnologia.
              Compre com segurança através do **Mercado Livre** ou **Shopee** com proteção de pagamento, 
              ou entre em contato direto pelo **WhatsApp** para atendimentoVIP imediato.
            </motion.p>

            {/* Actions Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                id="hero-buy-now"
                onClick={onExploreProducts}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 20px 25px -5px rgba(254, 230, 0, 0.15), 0 10px 10px -5px rgba(254, 230, 0, 0.10)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group flex items-center justify-center space-x-2 bg-[#FFE600] hover:bg-yellow-500 text-[#111111] font-bold px-8 py-4 rounded-xl cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Comprar Agora</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5 duration-300" />
              </motion.button>

              <motion.a
                id="hero-whatsapp-chat"
                href={whatsappUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  borderColor: "rgba(34, 197, 94, 0.5)",
                  backgroundColor: "rgba(34, 197, 94, 0.12)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex items-center justify-center space-x-2 bg-white/5 border border-white/10 text-white hover:text-green-400 font-semibold px-8 py-4 rounded-xl cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                <span>Falar no WhatsApp</span>
              </motion.a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/10"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#FFE600]" />
                <span className="text-xs font-mono text-gray-400">PAGAMENTO GARANTIDO</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#FFE600]" />
                <span className="text-xs font-mono text-gray-400">SATISFAÇÃO DO CLIENTE 100%</span>
              </div>
            </motion.div>

          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[420px]"
            >
              {/* Decorative Frame */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FFE600] via-[#111111] to-white/10 opacity-35 blur" />
              
              {/* Main Card Graphic */}
              <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/15 p-6 shadow-2xl flex flex-col justify-between">
                
                {/* Header branding */}
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Plataformas Integradas</span>
                  <span className="bg-green-500/20 text-green-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold">100% Sincronizado</span>
                </div>

                <div className="py-6 space-y-6">
                  {/* Mercado Livre Brand Box */}
                  <a
                    href="https://www.mercadolivre.com.br"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="group block p-4 rounded-xl bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/50 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {/* Handshake representation */}
                        <div className="bg-[#FFE600] text-[#111111] p-2.5 rounded-lg flex items-center justify-center font-black text-sm">
                          Hand
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-wide text-white">Mercado Livre</p>
                          <span className="text-[11px] text-[#FFE600]">Loja Oficial Ativa</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#FFE600] transition-colors" />
                    </div>
                  </a>

                  {/* Shopee Brand Box */}
                  <a
                    href="https://shopee.com.br"
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="group block p-4 rounded-xl bg-[#ee4d2d]/5 hover:bg-[#ee4d2d]/10 border border-[#ee4d2d]/20 hover:border-[#ee4d2d]/50 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#ee4d2d] text-white p-2.5 rounded-lg flex items-center justify-center font-black text-sm">
                          S
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-wide text-white">Shopee</p>
                          <span className="text-[11px] text-[#ee4d2d]">Cupom Frete Grátis</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#ee4d2d] transition-colors" />
                    </div>
                  </a>
                </div>

                {/* Micro Product Showcase */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-xs text-gray-400">Verifique nossos preços exclusivos</p>
                  <button
                    onClick={onExploreProducts}
                    className="mt-2 text-xs text-[#FFE600] font-sans hover:underline font-semibold flex items-center justify-center mx-auto space-x-1"
                  >
                    <span>Explorar catálogo completo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
