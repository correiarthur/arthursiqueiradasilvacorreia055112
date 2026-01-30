'use client'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PawPrint, Menu, X } from 'lucide-react' 
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-secondary/30 backdrop-blur-sm border-b border-border"
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <PawPrint className="w-8 h-8 text-primary" />
          </motion.div>
          <span className="text-xl font-bold text-primary font-sans">Melhor Amigo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="#recursos" className="text-foreground hover:text-secondary transition-colors font-serif">
            Recursos
          </Link>
          <Link to="#sobre" className="text-foreground hover:text-secondary transition-colors font-serif">
            Sobre
          </Link>
          <Link to="/cadastro-tutor">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md hover:shadow-lg transition-all">
              Entrar
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {menuAberto && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-b border-border"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="#recursos"
              className="text-foreground hover:text-secondary transition-colors font-serif py-2"
              onClick={() => setMenuAberto(false)}
            >
              Recursos
            </Link>
            <Link
              to="#sobre"
              className="text-foreground hover:text-secondary transition-colors font-serif py-2"
              onClick={() => setMenuAberto(false)}
            >
              Sobre
            </Link>
            <Link to="/cadastro-tutor" onClick={() => setMenuAberto(false)}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                Cadastrar-se
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}