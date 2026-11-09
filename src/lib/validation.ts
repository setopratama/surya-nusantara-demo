import type { AgeBand, ParticipantRegistration } from './types';

export interface ValidationErrors {
  name?: string;
  ageBand?: string;
  isConfirmed21Plus?: string;
  domicile?: string;
  occupation?: string;
  currentBrand?: string;
}

export function validateRegistration(
  data: Partial<ParticipantRegistration>
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Silakan masukkan nama atau username (minimal 2 karakter).';
  } else if (data.name.trim().length > 50) {
    errors.name = 'Nama maksimal 50 karakter.';
  }

  // Age band validation
  const validBands: AgeBand[] = ['18–24', '25–34', '35–44', '45+'];
  if (!data.ageBand || !validBands.includes(data.ageBand)) {
    errors.ageBand = 'Silakan pilih rentang usia Anda.';
  }

  // 21+ verification
  if (!data.isConfirmed21Plus) {
    errors.isConfirmed21Plus =
      'Anda harus menyatakan berusia 21 tahun atau lebih untuk mengikuti kuis.';
  }

  // Domicile validation
  if (!data.domicile || data.domicile.trim().length < 2) {
    errors.domicile = 'Silakan pilih atau masukkan kota domisili Anda.';
  }

  // Occupation validation
  if (!data.occupation || data.occupation.trim().length < 2) {
    errors.occupation = 'Silakan pilih bidang pekerjaan Anda.';
  }

  // Current brand validation
  if (!data.currentBrand || data.currentBrand.trim().length < 2) {
    errors.currentBrand = 'Silakan pilih preferensi merek Anda.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
