import { load, actions } from '$src/routes/createexercise/+page.server';
import { describe, it, expect, vi } from 'vitest';


vi.mock('sveltekit-superforms', () => ({
	setError: vi.fn(),
	superValidate: vi.fn()
}));  