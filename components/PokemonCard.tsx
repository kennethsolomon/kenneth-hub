
import React from 'react';

interface PokemonCardProps {
  name: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold capitalize">{name}</h3>
    </div>
  );
};

export default PokemonCard;