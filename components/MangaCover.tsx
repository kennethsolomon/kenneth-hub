import React from "react";
import Image from "next/image";

interface MangaCoverProps {
  src: string;
}

const MangaCover: React.FC<MangaCoverProps> = ({ src }) => {
  return (
    <Image
      src={src} // No need to use String(src), it's already a string
      alt="Manga Cover"
      width={400}
      height={200}
      priority
    />
  );
};

export default MangaCover;