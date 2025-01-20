import React from 'react';

const Logo: React.FC<{ width: number; height: number }> = ({
  width,
  height
}) => {
  return <img src="/logo.png" alt="Logo" width={width} height={height} />;
};

export default Logo;
