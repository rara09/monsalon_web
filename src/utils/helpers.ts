export default function getImagePath(path: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}${path}`;
}

export function formatPrice(value: number) {
  // format number to french format with space as thousand separator and "F CFA" suffix
  value = Math.round(value * 100) / 100;

  return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} F CFA`;

  // return `${value.toLocaleString('fr-FR')} F CFA`;
}
