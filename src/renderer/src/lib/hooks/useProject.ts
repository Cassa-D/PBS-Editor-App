import { useState } from "react";

export const useProject = () => {
  const [project, setProject] = useState<{ projectName: string; projectPath: string }>();

  const selectProject = (projName: string, projPath: string) => {
    setProject({ projectName: projName, projectPath: projPath });
  };

  return {
    ...project,
    setProject: selectProject,
  };
};
