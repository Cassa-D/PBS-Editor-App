import { useEffect, useState } from "react";
import { defaultAbility, type Ability } from "@lib/models/Ability";
import { importAbilities } from "@lib/services/importAbilities";
import { useProjectContext } from "@providers/ProjectProvider.tsx";
import { exportAbilitiesToPBS } from "@services/exportFormatter.ts";

export const useAbilityData = () => {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

  const { projectPath } = useProjectContext();

  // Select the first ability by default
  useEffect(() => {
    if (abilities.length > 0 && !selectedAbility) {
      setSelectedAbility(abilities[0]);
    } else {
      setSelectedAbility((prev) => abilities.find((a) => a.id === prev?.id) || abilities[0]);
    }
  }, [abilities, selectedAbility]);

  // Fetch and set initial Ability data
  const fetchAbilities = async () => {
    try {
      console.warn("Abilities not found. Fetching from PBS.");
      let pbsPath = `${projectPath}/PBS/abilities.txt`;
      if (navigator.platform.includes("Win")) {
        pbsPath = pbsPath.replace("/", "\\");
      }

      const data = await window.electron.ipcRenderer.invoke("read-file", pbsPath);
      // const gen9Data = await window.electron.ipcRenderer.invoke("read-file", `${pbsPath}abilities_Gen_9_Pack.txt`);
      const parsedAbilities = importAbilities(data);
      setAbilities(parsedAbilities);
      setSelectedAbility(parsedAbilities[0]);
    } catch (error) {
      console.error("Failed to load abilities.txt:", error);
    }
  };

  const loadAbilityData = async () => {
    await fetchAbilities();
    console.log("Finished loading Ability data.");
  };

  const savePBS = (newData: Ability[]) => {
    exportAbilitiesToPBS(newData, projectPath!);
    return newData;
  };

  const setAbilityData = (data: Ability) => {
    setAbilities((prev) => savePBS(prev.map((a) => (a.id === data.id ? data : a))));
  };

  const importMerge = (importedAbilities: Ability[]) => {
    setAbilities((prev) => {
      const merged = [...prev];
      importedAbilities.forEach((imported) => {
        const existing = merged.find((a) => a.id === imported.id);
        if (existing) {
          Object.assign(existing, imported);
        } else {
          merged.push(imported);
        }
      });
      return savePBS(merged);
    });
  };

  const importOverride = (importedAbilities: Ability[]) => {
    setAbilities(savePBS(importedAbilities));
  };

  const isAbilityInPokedex = (id: string) => {
    return !!abilities.find((a) => a.id === id);
  };

  const addAbility = async (id: string, baseAbility?: Ability) => {
    const data = { ...(baseAbility || defaultAbility) };

    data.id = id.trim().toUpperCase();
    data.name = id.trim();
    setAbilities((prev) => savePBS([...prev, data]));
    setSelectedAbility(data);
    return data;
  };

  const removeAbility = (id: string) => {
    setAbilities((prev) => savePBS(prev.filter((a) => a.id !== id)));
  };

  return {
    loadAbilityData,
    abilities,
    setAbilityData,
    selectedAbility,
    setSelectedAbility,
    isAbilityInPokedex,
    addAbility,
    removeAbility,
    importMerge,
    importOverride,
  };
};
