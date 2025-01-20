import Image from 'next/image';
import React from 'react';

const Logo: React.FC = () => {
  return <Image src="/logo.png" alt="Logo" width={64} height={64} />;
};

export default Logo;
