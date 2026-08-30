import type { Pokemon } from "@lib/models/Pokemon";
import FormSection from "../../layout/FormSection.tsx";
import Autocomplete from "@components/ui/Autocomplete.tsx";
import { usePokedexContext } from "@providers/PokedexProvider.tsx";
import { useEffect, useState } from "react";

const WildItemsSection = ({
  pokemon,
  setPokemon,
}: {
  pokemon: Pokemon;
  setPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
}) => {
  const [itemCommon, setItemCommon] = useState<string>(pokemon.wildItemCommon);
  const [itemUncommon, setItemUncommon] = useState<string>(pokemon.wildItemUncommon);
  const [itemRare, setItemRare] = useState<string>(pokemon.wildItemRare);

  const { items } = usePokedexContext();

  useEffect(() => setItemCommon(pokemon.wildItemCommon), [pokemon.wildItemCommon]);
  useEffect(() => setItemUncommon(pokemon.wildItemUncommon), [pokemon.wildItemUncommon]);
  useEffect(() => setItemRare(pokemon.wildItemRare), [pokemon.wildItemRare]);

  const handleFieldChange = (field: keyof Pokemon, value: string) => {
    setPokemon((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <FormSection
      title="Wild Items"
      tooltip="The IDs of items that a wild Pokémon of this species can be found holding."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Common Item */}
        <div>
          <label className="flex gap-2 items-center text-sm font-medium text-slate-300 mb-2 relative">
            Wild Item Common (50%)
          </label>
          <Autocomplete
            value={itemCommon}
            onValueChange={setItemCommon}
            options={items.map((i) => i.id)}
            placeholder="Enter item..."
            inputClass="w-full px-3 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300/70"
            onBlur={() => handleFieldChange("wildItemCommon", itemCommon)}
          />
        </div>
        {/* Wild Item Uncommon (5%) */}
        <div>
          <label className="flex gap-2 items-center text-sm font-medium text-slate-300 mb-2 relative">
            Wild Item Uncommon (5%)
          </label>
          <Autocomplete
            value={itemUncommon}
            onValueChange={setItemUncommon}
            options={items.map((i) => i.id)}
            placeholder="Enter item..."
            inputClass="w-full px-3 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300/70"
            onBlur={() => handleFieldChange("wildItemUncommon", itemUncommon)}
          />
        </div>
        {/* Wild Item Rare (1%) */}
        <div>
          <label className="flex gap-2 items-center text-sm font-medium text-slate-300 mb-2 relative">
            Wild Item Rare (1%)
          </label>
          <Autocomplete
            value={itemRare}
            onValueChange={setItemRare}
            options={items.map((i) => i.id)}
            placeholder="Enter item..."
            inputClass="w-full px-3 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300/70"
            onBlur={() => handleFieldChange("wildItemRare", itemRare)}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default WildItemsSection;
