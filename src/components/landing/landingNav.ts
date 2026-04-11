/** Liens vitrine : routes dédiées ou ancres sur la page d’accueil. */
export type LandingNavItem =
  | { label: string; to: string }
  | { label: string; hash: string };

export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', hash: '#experience' },
  { label: 'Services', hash: '#nos-services' },
  { label: 'Prestations', to: '/catalogue' },
  { label: 'Produits', to: '/produits' },
  { label: 'Galerie', hash: '#galerie' },
  { label: 'Contact', hash: '#contact' },
];

export function landingAnchorHref(pathname: string, hash: string): string {
  if (pathname === '/') return hash;
  return `/${hash}`;
}

export function reservationHref(pathname: string): string {
  return landingAnchorHref(pathname, '#reservation');
}
