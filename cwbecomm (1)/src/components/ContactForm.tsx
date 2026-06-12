import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Send, MessageCircle, ExternalLink, CheckCircle } from "lucide-react";
import { ContactData } from "../types";

interface ContactFormProps {
  whatsappNumber: string;
}

export default function ContactForm({ whatsappNumber }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, "");
  const whatsappDirectUrl = `https://wa.me/55${cleanWhatsappNumber}?text=Olá!%20Encontrei%20vocês%20no%20site%20e%20gostaria%20de%20um%20atendimento%20VIP.`;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Por favor, preencha os campos obrigatórios (Nome, E-mail e Mensagem).");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission to server/localStorage
    setTimeout(() => {
      // Save contact submission locally for the admin or trace
      const contacts = JSON.parse(localStorage.getItem("contact_submissions") || "[]");
      contacts.push({
        ...formData,
        id: "contact-" + Date.now(),
        date: new Date().toLocaleDateString("pt-BR"),
      });
      localStorage.setItem("contact_submissions", JSON.stringify(contacts));

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 1200);
  };

  return (
    <section id="contato" className="py-20 bg-gray-50 dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] dark:text-[#FFE600] bg-gray-200 dark:bg-neutral-800 px-3.5 py-1.5 rounded-full font-mono">
            Atendimento Rápido
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-[#111111] dark:text-white mt-4 mb-2">
            Fale Conosco Hoje Mesmo
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tem dúvidas sobre algum produto do catálogo? Escolha como deseja falar com nossa equipe comercial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Contact Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left bg-white dark:bg-neutral-950 p-8 sm:p-10 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-sm">
            
            <div>
              <h3 className="font-display font-medium text-2xl text-gray-900 dark:text-white mb-2">
                Canais de Atendimento
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Nosso suporte funciona de segunda a sexta-feira, das 09h às 18h. Respondemos suas mensagens em poucos minutos.
              </p>

              {/* Coordinates List */}
              <div className="space-y-5">
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-900 flex items-center justify-center text-gray-600 dark:text-[#FFE600] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[#111111] dark:text-white font-semibold text-xs uppercase tracking-wide font-mono">WhatsApp Vendas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">11 95897-5285</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-neutral-900 flex items-center justify-center text-gray-600 dark:text-[#FFE600] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[#111111] dark:text-white font-semibold text-xs uppercase tracking-wide font-mono">E-mail Comercial</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">migzinho2013@gmail.com</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Direct Instant Triggers */}
            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-neutral-800">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center justify-center space-x-2.5 w-full py-3.5 px-4 font-bold text-sm bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/10 transition-all text-center"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                <span>Conversar no WhatsApp Agora</span>
              </a>

              {/* Badges Link */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <a
                  href="https://www.mercadolivre.com.br"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-center space-x-1.5 p-2 px-3 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-gray-750 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-all font-mono"
                >
                  <span>Mercado Livre</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://shopee.com.br"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-center space-x-1.5 p-2 px-3 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-semibold text-gray-750 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-all font-mono"
                >
                  <span>Shopee</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-950 p-8 sm:p-10 rounded-3xl border border-gray-150 dark:border-neutral-800 shadow-sm flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5 text-left"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-mono mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-mono mb-2">
                        E-mail de Contato *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: carlos@email.com"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-mono mb-2">
                        Celular / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: (11) 99999-9999"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-mono mb-2">
                      Sua Mensagem *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escreva sua pergunta ou observação aqui..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-neutral-800 focus:outline-none focus:border-[#FFE600] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-[#111111] dark:bg-[#FFE600] text-white dark:text-[#111111] p-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-neutral-800 dark:hover:bg-yellow-400 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Enviando...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>

                </motion.form>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                    Sua mensagem foi entregue com sucesso à nossa equipe. Retornaremos em seu e-mail ou telefone o mais rápido possível!
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 text-xs text-[#111111] dark:text-[#FFE600] font-bold font-mono hover:underline uppercase tracking-wider"
                  >
                    Enviar uma Nova Mensagem
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
