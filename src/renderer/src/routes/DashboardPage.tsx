import { theme } from "@theme/colors.ts";
import { useProjectContext } from "@providers/ProjectProvider.tsx";
import { usePokedexContext } from "@providers/PokedexProvider.tsx";
import { Candy, ChevronRight, Crown, HandFist, Squirrel, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImportComponent from "@components/import/ImportComponent.tsx";

const DashboardPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const navigate = useNavigate();
  const { projectName } = useProjectContext();
  usePokedexContext();

  const navigationCards = [
    {
      title: "Pokemon",
      description: "Edit Pokemon species data, stats, types, and abilities",
      icon: Squirrel,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      hoverGlow: "hover:shadow-blue-500/25",
      link: "/pokemon"
    },
    {
      title: "Moves",
      description: "Manage move data, power, accuracy, and effects",
      icon: HandFist,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      hoverGlow: "hover:shadow-orange-500/25",
      link: "/moves"
    },
    {
      title: "Abilities",
      description: "Configure Pokemon abilities, flags, and their descriptions",
      icon: Crown,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      hoverGlow: "hover:shadow-green-500/25",
      link: "/abilities"
    },
    {
      title: "Items",
      description: "Manage items, their effects, and properties",
      icon: Candy,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      hoverGlow: "hover:shadow-purple-500/25",
      link: "/items"
    },
    {
      title: "Types",
      description: "Manage types and their interaction with each-other",
      icon: Zap,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      hoverGlow: "hover:shadow-red-500/25",
      link: "/types"
    }
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
        <div className="border-b border-slate-700/50 px-10">
          <div className={`${theme.colors.primary.textMuted} text-lg pointer-events-none`}>Project</div>
          <h1 className="text-4xl font-bold text-white mb-6 pointer-events-none">{projectName}</h1>
        </div>

        <div className="m-6">
          <div className="p-4 mb-8">
            <ImportComponent />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {navigationCards.map((card, index) => {
              const IconComponent = card.icon;
              const isHovered = hoveredCard === index;

              return (
                <button
                  key={card.title}
                  className={`group cursor-pointer relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${card.bgColor} ${card.borderColor} ${card.hoverGlow} hover:shadow-2xl`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(card.link)}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2 ml-5 group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                        {card.title}
                      </h3>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{card.description}</p>

                    <div className="flex items-center text-slate-300 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Edit {card.title}</span>
                      <ChevronRight
                        className={`w-4 h-4 ml-2 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/10 transition-colors duration-500"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
