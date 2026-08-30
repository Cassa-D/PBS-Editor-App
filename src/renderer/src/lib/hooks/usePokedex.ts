import { useAbilityData } from "./pokedex/useAbilityData.ts";
import { useMoveData } from "./pokedex/useMoveData.ts";
import { usePBSConstants } from "./pokedex/usePBSConstants.ts";
import { usePokemonData } from "./pokedex/usePokemonData.ts";
import { useItemData } from "./pokedex/useItemData.ts";
import { useEffect } from "react";
import { useProjectContext } from "@providers/ProjectProvider.tsx";

export const usePokedex = () => {
  const pokemonData = usePokemonData();
  const moveData = useMoveData();
  const abilityData = useAbilityData();
  const itemData = useItemData();
  const constantsData = usePBSConstants();

  const { projectPath } = useProjectContext();

  const loadData = () => {
    constantsData.loadPBSConstants();
    pokemonData.loadPokemonData();
    moveData.loadMoveData();
    abilityData.loadAbilityData();
    itemData.loadItemData();
  };

  const resetAllData = async () => {
    constantsData.resetAllConstants();
  };

  useEffect(() => {
    if (projectPath !== undefined) {
      resetAllData().then(loadData);
    }
  }, [projectPath]);

  return {
    // Pokemon data
    pokemon: pokemonData.pokemon,
    setPokemonData: pokemonData.setPokemonData,
    selectedPokemon: pokemonData.selectedPokemon,
    setSelectedPokemon: pokemonData.setSelectedPokemon,
    isPokemonInPokedex: pokemonData.isPokemonInPokedex,
    addPokemon: pokemonData.addPokemon,
    removePokemon: pokemonData.removePokemon,
    overridePokemonData: pokemonData.overridePokemonData,
    importPokemonMerge: pokemonData.importMerge,
    importPokemonOverride: pokemonData.importOverride,

    // Move data
    moves: moveData.moves,
    setMoveData: moveData.setMoveData,
    selectedMove: moveData.selectedMove,
    setSelectedMove: moveData.setSelectedMove,
    isMoveInPokedex: moveData.isMoveInPokedex,
    addMove: moveData.addMove,
    removeMove: moveData.removeMove,
    overrideMoveData: moveData.overrideMoveData,
    importMovesMerge: moveData.importMerge,
    importMovesOverride: moveData.importOverride,
    getMoveDataById: moveData.getMoveDataById,
    getMovesList: moveData.getMovesList,

    // Ability data
    abilities: abilityData.abilities,
    setAbilityData: abilityData.setAbilityData,
    selectedAbility: abilityData.selectedAbility,
    setSelectedAbility: abilityData.setSelectedAbility,
    isAbilityInPokedex: abilityData.isAbilityInPokedex,
    addAbility: abilityData.addAbility,
    removeAbility: abilityData.removeAbility,
    importAbilitiesMerge: abilityData.importMerge,
    importAbilitiesOverride: abilityData.importOverride,

    // Item data
    items: itemData.items,
    setItemData: itemData.setItemData,
    selectedItem: itemData.selectedItem,
    setSelectedItem: itemData.setSelectedItem,
    isItemInPokedex: itemData.isItemInPokedex,
    addItem: itemData.addItem,
    removeItem: itemData.removeItem,
    importItemsMerge: itemData.importMerge,
    importItemsOverride: itemData.importOverride,

    // Constants data
    types: constantsData.types,
    genderRatios: constantsData.genderRatios,
    growthRates: constantsData.growthRates,
    eggGroups: constantsData.eggGroups,
    colors: constantsData.colors,
    shapes: constantsData.shapes,
    habitats: constantsData.habitats,
    evolutionMethods: constantsData.evolutionMethods,
    pockets: constantsData.pockets,
    fieldUses: constantsData.fieldUses,
    battleUses: constantsData.battleUses,
    itemFlags: constantsData.itemFlags,
    moveFlags: constantsData.moveFlags,
    resetConstants: constantsData.resetConstant,
    resetAllConstants: constantsData.resetAllConstants,
    addConstant: constantsData.addConstant,
    removeConstant: constantsData.removeConstant,
    getTypeColor: constantsData.getTypeColor,
    updateTypeColor: constantsData.updateTypeColor,
  };
};
