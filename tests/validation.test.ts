import { describe, expect, it } from 'bun:test';
import { validateRegistration } from '../src/lib/validation';

describe('Registration Validation', () => {
  it('validates a valid registration payload', () => {
    const result = validateRegistration({
      name: 'Budi Santoso',
      ageBand: '25–34',
      isConfirmed21Plus: true,
      domicile: 'Surabaya',
      occupation: 'Karyawan Swasta',
      currentBrand: 'Surya / Gudang Garam Family',
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('rejects under 21 or unconfirmed 21+ participants', () => {
    const result = validateRegistration({
      name: 'Rian',
      ageBand: '18–24',
      isConfirmed21Plus: false,
      domicile: 'Jakarta Selatan',
      occupation: 'Wiraswasta',
      currentBrand: 'Djarum Family',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.isConfirmed21Plus).toBeDefined();
  });

  it('flags missing required fields', () => {
    const result = validateRegistration({
      name: '',
      isConfirmed21Plus: true,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.ageBand).toBeDefined();
    expect(result.errors.domicile).toBeDefined();
    expect(result.errors.occupation).toBeDefined();
    expect(result.errors.currentBrand).toBeDefined();
  });
});
