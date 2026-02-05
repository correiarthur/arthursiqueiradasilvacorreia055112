import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpa o DOM após cada teste
afterEach(() => {
    cleanup();
});
