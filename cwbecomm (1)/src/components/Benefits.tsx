import { motion } from "motion/react";
import { Truck, Award, Headphones, Lock } from "lucide-react";

export default function Benefits() {
  const list = [
    {
      icon: <Truck className="w-8 h-8 text-[#FFE600]" />,
      title: "Entrega Rápida",
      description: "Despachamos sua mercadoria no mesmo dia. Integração total com Mercado Envios e Shopee Xpress.",
    },
    {
      icon: <Award className="w-8 h-8 text-[#FFE600]" />,
      title: "Produtos de Qualidade",
      description: "Trabalhamos com marcas premium e produtos rigorosamente testados antes do envio.",
    },
    {
      icon: <Headphones className="w-8 h-8 text-[#FFE600]" />,
      title: "Suporte Especializado",
      description: "Atendimento humano, especializado e ágil via WhatsApp para tirar qualquer dúvida.",
    },
    {
      icon: <Lock className="w-8 h-8 text-[#FFE600]" />,
      title: "Compra Segura",
      description: "Garantimos o reembolso ou reenvio em caso de extravios ou devoluções em até 7 dias.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-neutral-900 border-y border-gray-200/50 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-neutral-950 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#111111] dark:bg-neutral-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="font-display font-medium text-lg text-[#111111] dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
