import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
    vi.useFakeTimers();

    it('deve retornar o valor inicial imediatamente', () => {
        const { result } = renderHook(() => useDebounce('teste', 500));
        expect(result.current).toBe('teste');
    });

    it('deve atualizar o valor após o delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'inicial', delay: 500 } }
        );

        expect(result.current).toBe('inicial');

        rerender({ value: 'atualizado', delay: 500 });

        expect(result.current).toBe('inicial');

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe('atualizado');
    });

    it('deve limpar o timeout ao mudar o valor rapidamente', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'v1', delay: 500 } }
        );

        rerender({ value: 'v2', delay: 500 });

        act(() => {
            vi.advanceTimersByTime(250);
        });

        rerender({ value: 'v3', delay: 500 });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(result.current).toBe('v1');

        act(() => {
            vi.advanceTimersByTime(250);
        });

        expect(result.current).toBe('v3');
    });
});
