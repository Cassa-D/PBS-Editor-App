import type { Pokemon } from "@/lib/models/Pokemon";
import FormSection from "../../layout/FormSection.tsx";
import TypeSelector from "../TypeSelector.tsx";
import AbilityArray from "../AbilityArray.tsx";

interface TypesAbilitiesSectionProps {
  pokemon: Pokemon;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
}

const TypesAbilitiesSection = ({
  pokemon,
  setPokemon,
}: TypesAbilitiesSectionProps) => {
  return (
    <FormSection title="Types and Abilities" className="space-y-6">
      <TypeSelector pokemon={pokemon} setPokemon={setPokemon} />
      <AbilityArray pokemon={pokemon} setPokemon={setPokemon} />
      <AbilityArray pokemon={pokemon} setPokemon={setPokemon} isHidden />
    </FormSection>
  );
};

export default TypesAbilitiesSection;
