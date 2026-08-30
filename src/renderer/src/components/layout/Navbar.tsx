import { useEffect, useState } from "react";
import {
  Home,
  LoaderPinwheel,
  HandFist,
  Crown,
  Database,
  Menu,
  X,
  Settings,
  Candy
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsModal from "./SettingsModal.tsx";
import { useProjectContext } from "@providers/ProjectProvider.tsx";

interface NavItemProps {
  item: {
    id: string;
    icon: React.ElementType;
    label: string;
  };
  onClick: (id: string) => void;
  isActive: boolean;
}

const navItems = [
  { id: "pokemon", icon: LoaderPinwheel, label: "Pokemon" },
  { id: "moves", icon: HandFist, label: "Moves" },
  { id: "abilities", icon: Crown, label: "Abilities" },
  { id: "items", icon: Candy, label: "Items" },
  { id: "constants", icon: Database, label: "Constants" }
];

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { projectPath } = useProjectContext();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const onLinkClicked = (id: string) => {
    setActiveItem(id);
    navigate(`/${id === "home" ? "" : id}`);
  };

  const getActivePage = () => {
    // Get the current active page based on the URL
    const path = window.location.hash;
    const page = path.split("/").pop();
    if (!page) return "home";
    return page;
  };

  useEffect(() => {
    const activePage = getActivePage();
    if (activePage) {
      setActiveItem(activePage);
    }
  }, [location.pathname]);

  const NavItem = ({ item, onClick, isActive }: NavItemProps) => {
    const Icon = item.icon;

    return (
      <button
        onClick={() => onClick(item.id)}
        className={`
          w-full flex items-center h-12 text-left transition-colors duration-200 relative cursor-pointer
          ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          }
        `}
      >
        <div className="w-16 flex justify-center flex-shrink-0">
          <Icon size={20} />
        </div>
        {isExpanded && (
          <span className="font-medium text-sm transition-opacity duration-300">
            {item.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className={`
          fixed left-0 top-0 h-full bg-slate-800 border-r border-slate-700
          transition-all duration-300 ease-in-out z-1000 flex flex-col overflow-x-hidden
          ${isExpanded ? "w-60" : "w-16"}
        `}
    >
      {/* Hamburger Toggle */}
      <div className="flex items-center justify-start pl-3 h-16 border-b border-slate-700">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer duration-200"
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 py-4">
        <NavItem
          item={{ id: "home", icon: Home, label: "Home" }}
          onClick={onLinkClicked}
          isActive={activeItem === "home"}
        />

        {!!projectPath &&
          navItems.map((item) => (
            <NavItem key={item.id} item={item} onClick={onLinkClicked} isActive={activeItem === item.id} />
          ))}
      </nav>

      {/* Bottom Buttons */}
      <div className="border-t border-slate-700 cursor-pointer">
        <SettingsModal
          triggerElement={
            <NavItem
              item={{ id: "settings", icon: Settings, label: "Settings" }}
              onClick={() => {}}
              isActive={false}
            />
          }
        />
      </div>
    </div>
  );
}

export default Navbar;
