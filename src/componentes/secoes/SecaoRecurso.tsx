'use client'

import { motion, Variants } from 'framer-motion'
import { ClipboardList, Bell, Users, Smartphone } from 'lucide-react'

const recursos = [
  {
    icone: ClipboardList,
    titulo: 'Cadastro',
    descricao: 'Registre todos os dados importantes do seu pet.',
  },
  {
    icone: Bell,
    titulo: 'Lembretes',
    descricao: 'Receba notificações.',
  },
  {
    icone: Users,
    titulo: 'Múltiplos Pets',
    descricao: 'Gerencie vários animais de estimação.',
  },
  {
    icone: Smartphone,
    titulo: 'Acesso',
    descricao: 'Tenha todas as informações na palma da mão.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export function SecaoRecurso() {
  return (
    <section id="recursos" className="py-24 px-4 bg-card">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-secondary/30 text-foreground rounded-full text-sm font-serif mb-4">
            Recursos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4 font-sans text-balance">
            Gestão pública de monitoramento e bem-estar pet
          </h2>
          <p className="text-card-foreground/70 max-w-2xl mx-auto font-serif leading-relaxed">
            Solução integrada para a gestão da saúde animal, garantindo a rastreabilidade vacinal, o fortalecimento da vigilância epidemiológica e a promoção da guarda responsável.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recursos.map((recurso) => (
            <motion.div
              key={recurso.titulo}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-background p-8 rounded-2xl shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-secondary/30 rounded-xl flex items-center justify-center mb-6">
                <recurso.icone className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-sans">{recurso.titulo}</h3>
              <p className="text-foreground/70 font-serif leading-relaxed">{recurso.descricao}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}