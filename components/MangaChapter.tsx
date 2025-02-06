import React from "react";
import Image from "next/image";

interface MangaChapterProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

const MangaChapter: React.FC<MangaChapterProps> = ({ src, ...props }) => {
  return (
    <div {...props}>
      <Image
        src={src}
        alt="Manga Cover"
        width={400}
        height={200}
        priority
      />
    </div>
  );
};

export default MangaChapter;