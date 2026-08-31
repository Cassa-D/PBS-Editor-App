import { useEffect, useState } from "react";
import { defaultPokemon, type Pokemon } from "@lib/models/Pokemon";
import { importPokemon } from "@lib/services/importPokemon";
import { useProjectContext } from "@providers/ProjectProvider.tsx";
import { exportPokemonToPBS } from "@services/exportFormatter.ts";

export const usePokemonData = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]); // Set shouldn't be exported
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const { projectPath } = useProjectContext();

  // If no Pokemon is selected, select the first one
  useEffect(() => {
    if (pokemon.length > 0 && !selectedPokemon) {
      setSelectedPokemon(pokemon.find((p) => p.id === "BULBASAUR") || pokemon[0]);
    } else {
      setSelectedPokemon(prev => pokemon.find((p) => p.id === prev?.id) || pokemon[0]);
    }
  }, [pokemon, selectedPokemon]);

  // Fetch and set initial Pokémon data
  const fetchPokemon = async () => {
    try {
      let pbsPath = `${projectPath}/PBS/pokemon.txt`;
      if (navigator.platform.includes("Win")) {
        pbsPath = pbsPath.replace("/", "\\");
      }

      const data = await window.electron.ipcRenderer.invoke("read-file", pbsPath);
      // const gen9Data = await window.electron.ipcRenderer.invoke("read-file", `${pbsPath}pokemon_base_Gen_9_Pack.txt`);
      const parsedPokemon = importPokemon(data).sort((a, b) => a.dexNumber - b.dexNumber);
      setPokemon(parsedPokemon);
      setSelectedPokemon(parsedPokemon[0]);
    } catch (error) {
      console.error("Failed to load pokemon.txt:", error);
    }
  };

  const loadPokemonData = async () => {
    await fetchPokemon();
    console.log("Finished loading Pokémon data.");
  };

  const savePBS = (newData: Pokemon[]) => {
    exportPokemonToPBS(newData, projectPath!);
    return newData;
  };

  // For updating existing Pokémon data
  // This overrides all data with the
  // specified unique ID.
  const setPokemonData = (data: Pokemon) => {
    setPokemon((prev) => savePBS(prev.map((p) => (p.id === data.id ? data : p))));
  };

  // Import and merge entire Pokémon data.
  const importMerge = (content: string) => {
    const imported = importPokemon(content, pokemon);
    setPokemon((prev) => {
      const merged = [...prev];
      imported.forEach((newPokemon) => {
        const index = merged.findIndex((p) => p.id === newPokemon.id);
        if (index !== -1) {
          // If it exists, merge the data
          merged[index] = { ...merged[index], ...newPokemon };
        } else {
          // If it doesn't exist, add it
          merged.push({ ...newPokemon });
        }
      });
      return savePBS(merged);
    });
    return imported;
  };

  // Import and override entire Pokémon data.
  const importOverride = (content: string) => {
    const imported = importPokemon(content);
    setPokemon(savePBS(imported));
    return imported;
  };

  const overridePokemonData = (id: string, data: Partial<Pokemon>) => {
    setPokemon((prev) => savePBS(prev.map((p) => (p.id === id ? { ...p, ...data } : p))));
  };

  // Makes sure a Pokemon exists within the dex.
  // Must be the unique identifier (Ex. BULBASAUR)
  const isPokemonInPokedex = (id: string): boolean => {
    return !!pokemon.find((p) => p.id === id);
  };

  // Adds a new Pokémon to the dex.
  // Takes a baseMon to copy default values from
  // Otherwise uses the defaults.
  const addPokemon = (id: string, baseMon?: Pokemon): Pokemon => {
    const data = { ...(baseMon || defaultPokemon) };

    data.id = id.trim().toUpperCase();
    data.name = id.trim();
    data.dexNumber = 0;
    setPokemon((prev) => savePBS([...prev, data]));
    setSelectedPokemon(data);
    return data;
  };

  // Removes a Pokémon from the dex.
  const removePokemon = (id: string) => {
    setPokemon((prev) => savePBS(prev.filter((p) => p.id !== id)));
  };

  return {
    loadPokemonData,
    pokemon,
    setPokemonData,
    overridePokemonData,
    selectedPokemon,
    setSelectedPokemon,
    isPokemonInPokedex,
    addPokemon,
    removePokemon,
    importMerge,
    importOverride
  };
};
