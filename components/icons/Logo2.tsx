import React from 'react';

const Logo2: React.FC<{ width: number; height: number }> = ({
  width,
  height
}) => {
  return (
    <img
      src="/logos/questraven-secondary.png"
      alt="Logo"
      width={width}
      height={height}
    />
  );
};

export default Logo2;
