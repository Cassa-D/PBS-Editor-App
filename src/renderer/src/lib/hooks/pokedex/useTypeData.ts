import { useEffect, useState } from "react";
import { defaultType, type Type } from "@models/Type.ts";
import { useProjectContext } from "@providers/ProjectProvider.tsx";
import { importTypes } from "@services/importTypes.ts";
import { formatPath } from "@utils/fileUtils";
import { exportTypesToPBS } from "@services/exportFormatter.ts";

export const useTypeData = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedType, setSelectedType] = useState<Type | null>(null);
  const [typeImg, setTypeImg] = useState<string | null>(null);

  const { projectPath } = useProjectContext();

  useEffect(() => {
    if (types.length > 0 && !selectedType) {
      setSelectedType(types[0]);
    } else {
      setSelectedType((prev) => types.find((t) => t.id === prev?.id) || types[0]);
    }
  }, [types, selectedType]);

  const fetchTypes = async () => {
    try {
      let pbsPath = formatPath(`${projectPath}/PBS/types.txt`);

      const data = await window.electron.ipcRenderer.invoke("read-file", pbsPath);
      const parsedTypes = importTypes(data);
      const imgData: string = await window.electron.ipcRenderer.invoke(
        "read-image",
        formatPath(`${projectPath}/Graphics/UI/types.png`)
      );
      setTypeImg(`data:image/png;base64,${imgData}`);

      setTypes(parsedTypes);
      setSelectedType(parsedTypes[0]);
    } catch (error) {
      console.error("Failed to load types.tsx", error);
    }
  };

  const loadTypeData = async () => {
    await fetchTypes();
    console.log("Finished loading types data.");
  };

  const savePBS = (newData: Type[]) => {
    exportTypesToPBS(newData, projectPath!);
    return newData;
  };

  const setTypeData = (data: Type) => {
    setTypes(prev => savePBS(prev.map((t) => (t.id === data.id ? data : t))));
  };

  const importMerge = (importedTypes: Type[]) => {
    setTypes((prev) => {
      const merged = [...prev];
      importedTypes.forEach((imported) => {
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

  const importOverride = (importedTypes: Type[]) => {
    setTypes(savePBS(importedTypes));
  };

  const isTypeInPokedex = (id: string) => {
    return !!types.find((t) => t.id === id);
  }

  const addType = async (id: string, baseType?: Type) => {
    const  data = { ...(baseType || defaultType) };

    data.id = id.trim().toUpperCase();
    data.name = id.trim();
    setTypes(prev => savePBS([...prev, data]));
    setSelectedType(data);
    return data;
  }

  const removeType = (id: string) => {
    setTypes(prev => savePBS(prev.filter(t => t.id === id)));
  }

  return {
    types,
    typeImg,
    selectedType,
    loadTypeData,
    setTypeData,
    setSelectedType,
    isTypeInPokedex,
    addType,
    removeType,
    importMerge,
    importOverride,
  };
};
