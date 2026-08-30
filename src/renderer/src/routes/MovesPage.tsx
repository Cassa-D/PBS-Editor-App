import { useEffect, useMemo, useState } from "react";
import { type Move } from "@lib/models/Move";
import { usePokedexContext } from "@lib/providers/PokedexProvider";
import MoveList from "@components/move/MoveList";
import MoveHeader from "@components/move/sections/MoveHeader";
import BasicMoveInfo from "@components/move/sections/BasicMoveInfo";
import BattleStats from "@components/move/sections/BattleStats";
import AdvancedProperties from "@components/move/sections/AdvancedProperties";
import MoveFlagsSection from "@components/move/sections/MoveFlagsSection";
import { useAlertContext } from "@lib/providers/AlertProvider";
import _ from "lodash";
import { useToastNotifications } from "@hooks/useToast.ts";

const MovesPage = () => {
  const {
    moves,
    selectedMove,
    setSelectedMove,
    removeMove,
    setMoveData,
    overrideMoveData,
  } = usePokedexContext();

  const [editData, setEditData] = useState<Move | null>(moves[0] || null);

  const { showWarning, showError } = useAlertContext();
  const { showSuccess } = useToastNotifications();

  useEffect(() => {
    if (selectedMove) {
      setEditData(selectedMove);
    }
  }, [selectedMove, setSelectedMove]);

  const handleSave = async () => {
    if (!selectedMove || !editData) return;

    const validationErrors: string[] = []; // Assume a validateMove function exists
    if (validationErrors.length > 0) {
      console.error("Validation Errors:", validationErrors);
      showError(
        "Validation Errors",
        `The following fields have an invalid input or have been left blank:\n\n ${validationErrors.join(
          "\n"
        )}`
      );
      return;
    }

    if (selectedMove.id != editData.id) {
      const response = await showWarning(
        "Different Move ID",
        `You've changed the unique Move id for ${selectedMove.name}. If you proceed, this move will be overwritten. It is recommended that if you want to change the ID, you instead create a new Move.`
      );

      // On Cancel
      if (!response) {
        const id = selectedMove.id;
        setEditData((prevMove) => (prevMove ? { ...prevMove, id } : null));
        return;
      }

      // On Confirm - proceed with save
      console.log("Overriding Move ID", selectedMove.id, editData.id);
      overrideMoveData(selectedMove.id, editData);
      showSuccess(`Move ${selectedMove.name} was overwritten.`)
      return;
    }

    console.log("Saving Move Data", editData);
    setMoveData(editData);
    showSuccess(`Move ${editData.name} was updated.`);
  };

  // Return to default values
  const handleReset = async () => {
    if (!selectedMove || !editData) return;

    if (
      await showWarning(
        "Reset to Default",
        `Are you sure you want to reset ${selectedMove.id} to its default values? This action cannot be undone.`
      )
    ) {
      setEditData((prev) => (prev ? { ...prev, ...selectedMove } : null));
      showSuccess(`Reseted ${selectedMove.name} values.`);
    }
  };

  const handleDelete = async () => {
    if (!selectedMove) return;

    if (
      await showWarning(
        "Delete Move?",
        `ATTENTION: Deleting ${selectedMove.name} will not remove it's ID from the Pokemon that had this move. Are you sure you want to do this?`
      )
    ) {
      removeMove(selectedMove.id);
      setSelectedMove(null);
      showSuccess(`Move ${selectedMove.name} was deleted.`);
    }
  };

  const memoMovesList = useMemo(() => {
    return (
      <MoveList
        selectedMove={selectedMove}
        onMoveSelect={(move) => {
          setSelectedMove(move);
          setEditData(move);
        }}
      />
    );
  }, [moves, selectedMove]);

  const dirty = useMemo(() => !_.isEqual(editData, selectedMove), [editData, selectedMove]);

  // Early return if no data is available
  if (!editData || !selectedMove) {
    return (
      <div className="flex h-screen text-slate-200 shadow-xl items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Move Data</h2>
          <p className="text-slate-400">Loading Move data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen text-slate-200 shadow-xl">
      {/* Left Sidebar - Move List */}
      {memoMovesList}

      {/* Main Content - Move Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <MoveHeader move={editData} onSave={handleSave} onReset={handleReset} onDelete={handleDelete} dirty={dirty} />

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-800">
          <div className="max-w-4xl mx-auto space-y-8 mb-60">
            {/* Basic Info */}
            <BasicMoveInfo move={editData} setMove={setEditData} />

            {/* Battle Stats */}
            <BattleStats move={editData} setMove={setEditData} />

            {/* Advanced Properties */}
            <AdvancedProperties move={editData} setMove={setEditData} />

            {/* Flags */}
            <MoveFlagsSection move={editData} setMove={setEditData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovesPage;
