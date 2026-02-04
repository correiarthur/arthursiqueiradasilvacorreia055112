import { z } from 'zod'

const regexApenasLetras = /^[A-Za-zÀ-ÿ\s]+$/

export const esquemaTutor = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .regex(regexApenasLetras, 'Nome deve conter apenas letras')
    .transform((valor) => valor.trim().replace(/\s+/g, ' ')),

  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine((valor) => {
      const apenasNumeros = valor.replace(/\D/g, '')
      return apenasNumeros.length === 11
    }, 'CPF deve ter 11 dígitos'),

  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),

  tipoContato: z.enum(['telefone', 'celular'], {
    message: 'Selecione o tipo de contato',
  }),

  numeroContato: z
    .string()
    .min(1, 'Número de contato é obrigatório'),

  endereco: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .max(500, 'Endereço deve ter no máximo 500 caracteres'),
})
  .refine((dados) => {
    const apenasNumeros = dados.numeroContato.replace(/\D/g, '')
    if (dados.tipoContato === 'telefone') {
      return apenasNumeros.length === 8
    }
    return apenasNumeros.length === 9
  }, {
    message: 'Número inválido para o tipo de contato selecionado',
    path: ['numeroContato'],
  })

export type DadosFormularioTutor = z.infer<typeof esquemaTutor>
