'use client'

import { motion } from 'framer-motion'

export function Rodape() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-primary text-primary-foreground py-5"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="text-center text-sm font-serif"><p>&copy; {new Date().getFullYear()} Melhor Amigo / Todos os direitos reservados</p></div>
        </div>
      </div>
    </motion.footer>
  )
}