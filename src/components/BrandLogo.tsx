import React from 'react';

interface BrandLogoProps {
  className?: string;
}

/** Shows only the supplied TK mark; the site name stays in the adjacent text lockup. */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => (
  <svg aria-hidden="true" viewBox="46 10 54 58" className={className} xmlns="http://www.w3.org/2000/svg">
    <image href="/trustkeys-logo.png" x="0" y="0" width="147" height="110" />
  </svg>
);
