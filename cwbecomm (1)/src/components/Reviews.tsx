import { motion } from "motion/react";
import { Star, MessageSquareQuote, Check } from "lucide-react";
import { Review } from "../types";

interface ReviewsProps {
  reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  return (
    <section id="depoimentos" className="py-20 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] dark:text-[#FFE600] bg-gray-100 dark:bg-neutral-800 px-3.5 py-1.5 rounded-full font-mono">
            Feedback do Cliente
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-[#111111] dark:text-white mt-4 mb-2">
            Quem compra, aprova!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Avaliações e opiniões autênticas coletadas diretamente de nossas páginas no Mercado Livre, Shopee e WhatsApp.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col justify-between p-8 bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 relative hover:border-gray-200 dark:hover:border-neutral-750 transition-all group text-left shadow-sm"
            >
              {/* Quote Background Deco */}
              <span className="absolute top-6 right-8 text-gray-200/50 dark:text-gray-800/40 pointer-events-none select-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <MessageSquareQuote className="w-10 h-10" />
              </span>

              {/* Star Rating with individual stagger entering animations */}
              <div className="flex items-center space-x-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isActive = i < review.rating;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 350, 
                        damping: 15, 
                        delay: (idx * 0.08) + (i * 0.06) 
                      }}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isActive ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Review Comment */}
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">
                "{review.comment}"
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center space-x-3 mt-auto pt-4 border-t border-gray-200/50 dark:border-neutral-800">
                {review.avatar && (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-neutral-800"
                    loading="lazy"
                  />
                )}
                <div>
                  <h4 className="font-sans font-semibold text-xs text-gray-900 dark:text-white leading-tight">
                    {review.name}
                  </h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center p-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-green-600 dark:text-green-400 font-bold">
                      Cliente Verificado • {review.date}
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
