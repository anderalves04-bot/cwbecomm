import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsappNumber: string;
}

export default function WhatsAppButton({ whatsappNumber }: WhatsAppButtonProps) {
  const cleanNumber = whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/55${cleanNumber}?text=Olá!%20Visitei%20o%20seu%20catálogo%20e%20gostaria%20de%20conversar%20sobre%20os%20produtos.`;

  return (
    <motion.a
      id="floating-whatsapp-action"
      href={whatsappUrl}
      target="_blank"
      referrerPolicy="no-referrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: 1
      }}
      whileHover={{ 
        scale: 1.12,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/20 transition-all flex items-center justify-center cursor-pointer group"
      title="Fale no WhatsApp"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-35" />
      
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1, 1.1, 1],
          rotate: [0, 6, -6, 6, -6, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          repeatDelay: 5
        }}
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-none group-hover:scale-110 transition-transform" />
      </motion.div>
    </motion.a>
  );
}
