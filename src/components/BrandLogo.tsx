import React from 'react';

interface BrandLogoProps {
  className?: string;
}

/** Uses the supplied Trustkeys artwork so the original monogram is preserved. */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => (
  <img
    src="/trustkeys-logo.png"
    alt="Trustkeys"
    className={className}
    draggable={false}
  />
);
