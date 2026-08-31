import { defaultItem, type Item } from "@lib/models/Item";
import { useEffect, useState } from "react";
import { importItems } from "@lib/services/importItems";
import { useProjectContext } from "@providers/ProjectProvider.tsx";
import { exportItemsToPBS } from "@services/exportFormatter.ts";


export const useItemData = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { projectPath } = useProjectContext();

  // Select the first item by default
  useEffect(() => {
    if (items.length > 0 && !selectedItem) {
      setSelectedItem(items[0]);
    } else {
      setSelectedItem((prev) => items.find((i) => i.id === prev?.id) || items[0]);
    }
  }, [items, selectedItem]);

  // Fetch and set initial Item data
  const fetchItems = async () => {
    try {
      let pbsPath = `${projectPath}/PBS/items.txt`;
      if (navigator.platform.includes("Win")) {
        pbsPath = pbsPath.replace("/", "\\");
      }

      const data = await window.electron.ipcRenderer.invoke("read-file", pbsPath);
      // const gen9Data = await window.electron.ipcRenderer.invoke("read-file", `${pbsPath}items_Gen_9_Pack.txt`);
      const parsedItems = importItems(data);
      setItems(parsedItems);
      setSelectedItem(parsedItems[0]);
    } catch (error) {
      console.error("Failed to load items.txt:", error);
    }
  };

  const loadItemData = async () => {
    await fetchItems();
    console.log("Finished loading Item data.");
  };

  const savePBS = (newData: Item[]) => {
    exportItemsToPBS(newData, projectPath!);
    return newData;
  };

  const setItemData = (data: Item) => {
    setItems((prev) => savePBS(prev.map((a) => (a.id === data.id ? data : a))));
  };

  const importMerge = (importedItems: Item[]) => {
    setItems((prev) => {
      const merged = [...prev];
      importedItems.forEach((imported) => {
        const existing = merged.find((a) => a.id === imported.id);
        if (existing) {
          Object.assign(existing, imported);
        } else {
          merged.push(imported);
        }
      });
      return savePBS(merged);
    });
  }

  const importOverride = (importedItems: Item[]) => {
    setItems(savePBS(importedItems));
  };

  const isItemInPokedex = (itemId: string): boolean => {
    return items.some((item) => item.id === itemId);
  }

  const addItem = (id: string, baseItem?: Item) => {
    const data = {...(baseItem || defaultItem)};

    data.id = id.trim().toUpperCase();
    // data.name = baseItem ? baseItem.name : id.trim();
    setItems((prev) => savePBS([...prev, data]));
    setSelectedItem(data);
    return data;
  }

  const removeItem = (id: string) => {
    setItems((prev) => savePBS(prev.filter((item) => item.id !== id)));
  };

  return {
    loadItemData,
    items,
    setItemData,
    selectedItem,
    setSelectedItem,
    isItemInPokedex,
    addItem,
    removeItem,
    importMerge,
    importOverride,
  };
}
