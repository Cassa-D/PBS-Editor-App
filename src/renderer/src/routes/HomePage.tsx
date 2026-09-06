import { useEffect, useState } from "react";
import {
  Users,
  Target,
  ChevronRight,
  Github,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UpdatesSection from "@components/layout/UpdatesSection";
import { useToast } from "@hooks/useToast.ts";
import { format } from "date-fns";
import { useProjectContext } from "@providers/ProjectProvider.tsx";

const ORIGINAL_SOURCE_CODE_LINK = "https://github.com/atendev/PBS-Editor";
const APP_SOURCE_CODE_LINK = "https://github.com/Cassa-D/PBS-Editor-App";

const LAST_PROJECTS_KEY = "lastProjs";

interface LastProjects {
  [key: string]: {
    projPath: string;
    timestamp: number;
  };
}

const HomePage = () => {
  const [lastProjects, setLastProjects] = useState<LastProjects>({});

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { setProject } = useProjectContext();

  useEffect(() => {
    setLastProjects(JSON.parse(window.localStorage.getItem(LAST_PROJECTS_KEY) || "[]"));
  }, []);

  const navigateToSourceCode = () => {
    window.open(ORIGINAL_SOURCE_CODE_LINK, "_blank");
  };

  const navigateToAppSourceCode = () => {
    window.open(APP_SOURCE_CODE_LINK, "_blank");
  };

  const selectProject = async ({ projName, projPath }: { projName: string, projPath: string }) => {
    const newProjList = { ...lastProjects, [projName]: { projPath, timestamp: Date.now() } } as LastProjects;
    window.localStorage.setItem(LAST_PROJECTS_KEY, JSON.stringify(newProjList));
    setLastProjects(newProjList);

    setProject(projName, projPath);
    navigate("/dashboard");
  };

  const openProject = async () => {
    const selectedPath: string | null = await window.electron.ipcRenderer.invoke("select-directory");
    if (selectedPath === null) return;

    if (!selectedPath.endsWith("PBS")) {
      const isValid = await window.electron.ipcRenderer.invoke("validate-project", selectedPath);
      if (!isValid) {
        addToast({
          type: "error",
          title: "Not a valid project!",
          description: "Select the folder that contains '.rxproj' or the PBS folder."
        });
        return;
      }
    }

    const projPath = selectedPath.replace(/[\/\\]PBS/g, "");
    const projName = projPath.split(/[\/\\]/g).pop()!;

    await selectProject({ projName, projPath });
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      <UpdatesSection />
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm h-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3 pointer-events-none">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PBS Editor</h1>
                <p className="text-sm text-slate-400">Pokemon Essentials</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center items-center">
              <p className="text-sm text-slate-400">Created by Aten.Dev</p>
              <button
                className="text-slate-400 hover:text-white transition-all rounded-lg flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 cursor-pointer p-2"
                onClick={navigateToSourceCode}
              >
                <Github className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">PBS Editor</span>
              </button>
              <p className="text-sm text-slate-400">Forked by Cassa-D</p>
              <button
                className="text-slate-400 hover:text-white transition-all rounded-lg flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 cursor-pointer p-2"
                onClick={navigateToAppSourceCode}
              >
                <Github className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">PBS Editor App</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-6 pointer-events-none">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Pokemon Essentials
            </span>
            <br />
            <span className="text-slate-200">PBS Editor</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed pointer-events-none">
            A powerful and modern user interface for editing PBS data to be used within Pokemon Essentials. You can
            import, edit, and export your own PBS files or use the defaults included with this editor.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={openProject}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Select Project</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              className="flex items-center space-x-2 text-slate-300 hover:text-white px-8 py-4 rounded-xl border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
              onClick={navigateToSourceCode}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">View Documentation</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-slate-400 leading-relaxed pointer-events-none">Recent projects:</p>

          {Object.keys(lastProjects)
            .map((key) => ({ ...lastProjects[key], projName: key }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((project) => (
              <div
                key={project.projName + project.projPath}
                className={`p-3 border-b border-slate-500 hover:bg-linear-to-r hover:to-slate-600/40 cursor-pointer hover:transition-colors`}
                onClick={() => selectProject(project)}
              >
                <span>{project.projName}</span>
                {" - "}
                <span>Last opened: {format(project.timestamp, "dd/MM/yyyy - hh:mm:ss")}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
