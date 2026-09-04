import { defaultMove, type Move } from "@lib/models/Move";
import { useEffect, useState } from "react";
import { importMoves } from "@lib/services/importMoves";
import { useProjectContext } from "@providers/ProjectProvider.tsx";
import { exportMovesToPBS } from "@services/exportFormatter.ts";
import { formatPath } from "@utils/fileUtils";

export const useMoveData = () => {
  const [moves, setMoves] = useState<Move[]>([]);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);

  const { projectPath } = useProjectContext();

  // Select the first move by default
  useEffect(() => {
    if (moves.length > 0 && !selectedMove) {
      setSelectedMove(moves[0]);
    } else {
      setSelectedMove((prev) => moves.find((m) => m.id === prev?.id) || moves[0]);
    }
  }, [moves, selectedMove]);

  // Fetch and set initial Move data
  const fetchMoves = async () => {
    try {
      let pbsPath = formatPath(`${projectPath}/PBS/moves.txt`);

      const data = await window.electron.ipcRenderer.invoke("read-file", pbsPath);
      // const gen9Data = await window.electron.ipcRenderer.invoke("read-file", `${pbsPath}moves_Gen_9_Pack.txt`);
      const parsedMoves = importMoves(data);

      setMoves(parsedMoves);
      setSelectedMove(parsedMoves[0]);
    } catch (error) {
      console.error("Failed to load moves.txt:", error);
    }
  };

  const loadMoveData = async () => {
    await fetchMoves();
  };

  const savePBS = (newData: Move[]) => {
    exportMovesToPBS(newData, projectPath!);
    return newData;
  };

  const setMoveData = (data: Move) => {
    setMoves((prev) => savePBS(prev.map((m) => (m.id === data.id ? data : m))));
  };

  const importMerge = (importedMoves: Move[]) => {
    setMoves((prev) => {
      const merged = [...prev];
      importedMoves.forEach((imported) => {
        const existing = merged.find((m) => m.id === imported.id);
        if (existing) {
          Object.assign(existing, imported);
        } else {
          merged.push(imported);
        }
      });
      return savePBS(merged);
    });
  };

  const importOverride = (importedMoves: Move[]) => {
    setMoves(savePBS(importedMoves));
  };

  const overrideMoveData = (id: string, data: Move) => {
    setMoves((prev) => savePBS(prev.map((m) => (m.id === id ? data : m))));
  };

  const isMoveInPokedex = (id: string) => {
    return !!moves.find((m) => m.id === id);
  };

  const addMove = (id: string, baseMove?: Move) => {
    const data = { ...(baseMove || defaultMove) };

    data.id = id.trim().toUpperCase();
    data.name = id.trim();
    setMoves((prev) => savePBS([...prev, data]));
    setSelectedMove(data);
    return data;
  };

  const removeMove = (id: string) => {
    setMoves((prev) => savePBS(prev.filter((m) => m.id !== id)));
    if (selectedMove?.id === id) {
      setSelectedMove(moves[0]);
    }
  };

  const getMoveDataById = (id: string): Move | null => {
    return moves.find((m) => m.id === id) || null;
  };

  const getMovesList = (): string[] => {
    return moves.map(move => move.id);
  }

  return {
    loadMoveData,
    moves,
    setMoveData,
    selectedMove,
    setSelectedMove,
    isMoveInPokedex,
    addMove,
    removeMove,
    overrideMoveData,
    importMerge,
    importOverride,
    getMoveDataById,
    getMovesList
  };
};
