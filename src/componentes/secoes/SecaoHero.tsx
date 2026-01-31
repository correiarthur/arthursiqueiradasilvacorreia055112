'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Heart, Shield, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function SecaoHero() {
  return (
    <section className="py-16 pt-32 flex items-center justify-center px-4 select-none cursor-default">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-secondary/30 text-foreground rounded-full text-sm font-serif mb-6"
            >
              Cuidando de quem você ama
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 font-sans text-balance"
            >
              Ecossistema de gestão{' '}
              <span className="text-secondary">pet</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 font-serif leading-relaxed"
            >
              Plataforma unificada para o acompanhamento integral do bem-estar animal. Centralize o cronograma vacinal e o prontuário clínico em um ambiente oficial e seguro.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/cadastro-tutor">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                >
                  Iniciar Cadastro
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="grid h-[50vh] w-xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-card p-2 rounded-2xl shadow-lg border border-border"
              >
                <img
                  src="/imagens/caramelo.jpg"
                  alt="Agendamento de Consultas"
                  className="w-full h-full object-cover rounded-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}