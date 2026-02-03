'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const beneficios = [
  'Cadastro rápido e intuitivo',
  'Atualizações constantes',
]

export function SecaoSobre() {
  return (
    <section id="sobre" className="pb-12 pt-5 px-4 bg-background select-none cursor-default">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/40 rounded-2xl -z-10"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-muted rounded-xl -z-10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center items-center"
          >
            <span className="inline-block px-4 py-2 bg-secondary/30 text-foreground rounded-full text-sm font-serif mb-4">
              Sobre Nós
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-sans text-balance">
              Pensado para quem ama seus pets
            </h2>
            <p className="text-foreground/70 mb-8 font-serif leading-relaxed">
              O Melhor Amigo nasceu da necessidade de ter um lugar único e organizado para 
              guardar todas as informações importantes sobre nossos companheiros de quatro patas. 
            </p>

            <ul className="space-y-4">
              {beneficios.map((beneficio, index) => (
                <motion.li
                  key={beneficio}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                  <span className="text-foreground font-serif">{beneficio}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}