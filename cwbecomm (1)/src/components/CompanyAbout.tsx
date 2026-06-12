import { motion } from "motion/react";
import { BookOpen, Target, Eye, Heart, BarChart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function AnimatedCounter({ 
  end, 
  decimals = 0, 
  duration = 2000, 
  prefix = "", 
  suffix = "" 
}: { 
  end: number; 
  decimals?: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const countStarted = useRef(false);

  useEffect(() => {
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countStarted.current) {
          countStarted.current = true;
          let startTime: number | null = null;
          
          const step = (timestamp: number) => {
            if (!active) return;
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(progress * end);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [end, duration]);

  return <span ref={elementRef}>{prefix}{count.toFixed(decimals)}{suffix}</span>;
}

export default function CompanyAbout() {
  const values = [
    {
      icon: <Target className="w-5 h-5 text-[#FFE600]" />,
      title: "Missão",
      description: "Conectar nossos clientes aos melhores produtos globais com preços competitivos, garantindo uma experiência de compra ágil, segura e 100% transparente.",
    },
    {
      icon: <Eye className="w-5 h-5 text-[#FFE600]" />,
      title: "Visão",
      description: "Ser reconhecida como a maior e mais confiável distribuidora multicanal integrada ao ecossistema do Mercado Livre, Shopee e WhatsApp.",
    },
    {
      icon: <Heart className="w-5 h-5 text-[#FFE600]" />,
      title: "Valores",
      description: "Nossos pilares fundamentais de atuação consistem na honestidade e transparência operacional, atendimento focado no cliente, logística impecável e inovação constante.",
    },
  ];

  const benefitsDiff = [
    "Parceria ativa com as maiores transportadoras brasileiras",
    "Estoque próprio local de pronta entrega em São Paulo",
    "Garantia de devolução simplificada sem questionamentos",
    "Canais oficiais verificados Mercado Líder Platinum e Shopee Indicado",
  ];

  return (
    <section id="sobre" className="py-20 bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bento Grid Design Pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* History Story Column */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] dark:text-[#FFE600] bg-gray-200 dark:bg-neutral-800 px-3.5 py-1.5 rounded-full font-mono w-fit">
              Quem Somos
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-[#111111] dark:text-white mt-4 mb-6">
              Nossa História e Compromisso Ecológico
            </h2>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Fundada em 2021 em São Paulo, a <strong>cwbecomm</strong> nasceu da percepção de que o comércio brasileiro necessitava de uma conexão mais humana e unificada entre os gigantes marketplaces digitais. Começando como uma pequena operação familiar, expandimos rapidamente graças ao nosso foco absoluto na experiência pós-venda.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              Hoje faturamos e distribuímos milhares de produtos eletrônicos e acessórios de alta performance para todos os estados do Brasil. Nossas qualificações como o inovador faturamento cwbecomm e marcas parceiras refletem a confiança e o carinho com que cuidamos de cada encomenda.
            </p>

            {/* Differential indicators */}
            <div className="space-y-3">
              <p className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">Por que escolher a cwbecomm?</p>
              {benefitsDiff.map((diff, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFE600] flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{diff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars Cards Block (Missão-Visão-Valores) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm text-left hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-neutral-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {v.icon}
                  </div>
                  <h3 className="font-display font-medium text-lg text-gray-900 dark:text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {v.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Micro Stats Banner */}
            <div className="bg-[#111111] text-white p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-0 mt-2 shadow-xl">
              <div className="text-center">
                <p className="text-3xl font-display font-black text-[#FFE600]">
                  <AnimatedCounter end={25} prefix="+" suffix="k" />
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Pedidos Entregues</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-display font-black text-white">
                  <AnimatedCounter end={4.9} decimals={1} suffix="/5" />
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Avaliações das Lojas</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-display font-black text-[#FFE600]">
                  <AnimatedCounter end={12} prefix="&lt; " suffix="h" />
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Tempo Médio de Envio</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
