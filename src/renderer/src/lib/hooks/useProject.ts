import { useEffect, useState } from "react";

const OLD_TYPE_BUBBLE_KEY = "USES_OLD_TYPE_BUBBLE";

export const useProject = () => {
  const [project, setProject] = useState<{ projectName: string; projectPath: string }>();
  const [usesOldTypeBubble, setUsesOldTypeBubble] = useState<boolean>(false);

  const selectProject = (projName: string, projPath: string) => {
    setProject({ projectName: projName, projectPath: projPath });
  };

  useEffect(() => {
    setUsesOldTypeBubble(localStorage.getItem(OLD_TYPE_BUBBLE_KEY) === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(OLD_TYPE_BUBBLE_KEY, JSON.stringify(usesOldTypeBubble));
  }, [usesOldTypeBubble]);

  return {
    ...project,
    setProject: selectProject,
    usesOldTypeBubble,
    setUsesOldTypeBubble,
  };
};
