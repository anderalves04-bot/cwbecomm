import { ShoppingBag, ArrowUp, ExternalLink, ShieldCheck, Mail, Phone } from "lucide-react";

interface FooterProps {
  onNavigateSection: (href: string) => void;
  whatsappNumber: string;
}

export default function Footer({ onNavigateSection, whatsappNumber }: FooterProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 border-t border-white/5 font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="text-left space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-[#FFE600] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#111111]" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                cwbe<span className="text-[#FFE600]">comm</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Sua melhor escolha em tecnologia e acessórios com segurança assegurada. Integrado aos maiores ecossistemas de e-commerce da América Latina.
            </p>
            <div className="flex space-x-3.5 pt-2">
              <span className="text-[10px] bg-white/5 border border-white/10 p-1.5 px-2.5 rounded font-mono text-[#FFE600]" title="Mercado Líder Platinum">
                MERCADO LÍDER
              </span>
              <span className="text-[10px] bg-white/5 border border-white/10 p-1.5 px-2.5 rounded font-mono text-orange-400" title="Shopee Indicado">
                SHOPEE INDICADO
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="text-left space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-300">
              Navegação
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm text-gray-400">
              <button
                onClick={() => onNavigateSection("#home")}
                className="text-left hover:text-[#FFE600] transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => onNavigateSection("#produtos")}
                className="text-left hover:text-[#FFE600] transition-colors"
              >
                Catálogo de Produtos
              </button>
              <button
                onClick={() => onNavigateSection("#sobre")}
                className="text-left hover:text-[#FFE600] transition-colors"
              >
                História & Práticas
              </button>
              <button
                onClick={() => onNavigateSection("#depoimentos")}
                className="text-left hover:text-[#FFE600] transition-colors"
              >
                Depoimentos
              </button>
            </div>
          </div>

          {/* Channels Column */}
          <div className="text-left space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-300">
              Canais Oficiais
            </h4>
            <div className="flex flex-col space-y-2.5 text-sm text-gray-400">
              <a
                href="https://www.mercadolivre.com.br"
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center space-x-1.5 hover:text-[#FFE600] transition-colors"
              >
                <span>Mercado Livre</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://shopee.com.br"
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center space-x-1.5 hover:text-[#FFE600] transition-colors"
              >
                <span>Shopee Oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://wa.me/55${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center space-x-1.5 hover:text-[#FFE600] transition-colors"
              >
                <span>WhatsApp Vendas</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Verification Banner Column */}
          <div className="text-left space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-gray-300">
              Segurança Garantida
            </h4>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-1.5 text-xs text-gray-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#FFE600]" />
                <span>Certificado SSL Ativo</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Suas conexões e redirecionamentos às carteiras são blindados e regulamentados pelas maiores bandeiras nacionais.
              </p>
            </div>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 sm:gap-0">
          <p className="text-[11px] text-gray-400 font-mono">
            &copy; {currentYear} cwbecomm LTDA. Todos os direitos reservados. CNPJ: 45.897.528/0001-90
          </p>

          <button
            onClick={handleScrollTop}
            className="flex items-center space-x-1.5 bg-white/5 border border-white/10 hover:border-[#FFE600]/40 text-gray-300 hover:text-white text-xs font-semibold px-4.5 py-2 rounded-xl transition-all"
            title="Voltar ao início"
          >
            <span>Voltar ao Topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
