import { describe, it, expect } from 'vitest';
import { validadorCPF } from './utils';

describe('validadorCPF', () => {
    it('deve retornar true para um CPF válido', () => {
        expect(validadorCPF('52998224725')).toBe(true);
    });

    it('deve retornar false para CPFs com todos os dígitos iguais', () => {
        expect(validadorCPF('11111111111')).toBe(false);
        expect(validadorCPF('22222222222')).toBe(false);
    });

    it('deve retornar false para CPFs com tamanho inválido', () => {
        expect(validadorCPF('123')).toBe(false);
        expect(validadorCPF('123456789012')).toBe(false);
    });

    it('deve retornar false para CPF com dígitos verificadores errados', () => {
        expect(validadorCPF('04445025061')).toBe(false);
        expect(validadorCPF('18017267031')).toBe(false);
    });

    it('deve validar CPF com máscara', () => {
        expect(validadorCPF('529.982.247-25')).toBe(true);
    });
});
