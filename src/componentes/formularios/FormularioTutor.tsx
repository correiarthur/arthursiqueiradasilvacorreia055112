import { CornerDownLeft, CreditCard, Loader2, Mail, MapPin, PawPrint, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FormularioTutor() {
    const [carregando] = useState(false)

    return (
        <div className="select-none cursor-default">
            <div className='space-x-2 flex flex-col flex-[2] py-12'>
                <div className="pl-4">
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                    >
                        <Link to="/">
                            <Button
                                type="submit"
                                className="w-1/18 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                <CornerDownLeft className="w-15 h-15 font-bold" />
                                <span className="font-bold">Voltar</span>
                            </Button>
                        </Link>
                    </motion.div>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <motion.div
                        whileHover={{ rotate: 15 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <PawPrint className="w-8 h-8 text-primary" />
                    </motion.div>
                    <span className="text-xl font-bold text-primary font-sans">Melhor Amigo</span>
                </div>
            </div>
            <motion.div className='flex items-center justify-center flex-col'>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-sans">
                    Cadastro de Tutor
                </h1>
                <p className="text-foreground/70 font-serif leading-relaxed pb-6">
                    Preencha os dados abaixo para criar sua conta e começar a gerenciar seus pets.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card rounded-3xl shadow-xl p-8 md:p-10 border border-border w-[40%] mx-auto"
            >
                <form className="space-y-6">
                    <motion.div
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2 flex flex-col md:flex-row items-start gap-4"
                    >
                        <div className="flex flex-col gap-2 flex-[2] w-1/2">
                            <Label htmlFor="nomeCompleto" className="text-foreground font-serif flex items-center gap-2 font-bold">
                                <User className="w-4 h-4 font-bold" />
                                Nome completo
                            </Label>
                            <Input
                                id="nomeCompleto"
                                type="text"
                                placeholder="Digite seu nome completo"
                                className="rounded-xl border-border bg-background focus:border-primary focus:ring-primary w-full placeholder:opacity-50"
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1 w-1/5">
                            <Label htmlFor="cpf" className="text-foreground font-bold font-serif flex items-center gap-2">
                                <CreditCard className="w-4 h-4 font-bold" />
                                CPF
                            </Label>
                            <Input
                                id="cpf"
                                type="text"
                                placeholder="000.000.000-00"
                                className="rounded-xl border-border bg-background focus:border-primary focus:ring-primary placeholder:opacity-50"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2 flex flex-col md:flex-row items-start gap-4"
                    >
                        <div className="flex flex-col gap-2 flex-[2] w-1/2">
                            <Label htmlFor="email" className="text-foreground font-serif flex items-center gap-2 font-bold">
                                <Mail className="w-4 h-4 font-bold" />
                                E-mail
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                className="rounded-xl border-border bg-background focus:border-primary focus:ring-primary placeholder:opacity-50"
                            />
                        </div>
                        <div className="flex flex-col gap-2 flex-1 w-1/5">
                            <Label htmlFor="tipoContato" className="text-foreground font-serif flex items-center gap-2 font-bold">
                                <Phone className="w-4 h-4 font-bold" />
                                Tipo de contato
                            </Label>
                            <Select
                            >
                                <SelectTrigger className="rounded-xl border-border bg-background">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="celular">Celular</SelectItem>
                                    <SelectItem value="telefone">Telefone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 flex-1 w-1/3">
                            <Label htmlFor="numeroContato" className="text-foreground font-serif font-bold">
                                Número
                            </Label>
                            <Input
                                id="numeroContato"
                                type="text"
                                placeholder="Informe o número"
                                className="rounded-xl border-border bg-background focus:border-primary focus:ring-primary placeholder:opacity-50"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2 flex flex-col items-start"
                    >
                        <Label htmlFor="endereco" className="text-foreground font-serif flex items-center gap-2 font-bold">
                            <MapPin className="w-4 h-4 font-bold" />
                            Endereço completo
                        </Label>
                        <Input
                            id="endereco"
                            type="text"
                            placeholder="Rua, número, bairro, cidade - Estado"
                            className="rounded-xl border-border bg-background focus:border-primary focus:ring-primary placeholder:opacity-50"
                        />
                    </motion.div>
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                    >
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {carregando ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Cadastrando...
                                </>
                            ) : (
                                'Criar conta'
                            )}
                        </Button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}