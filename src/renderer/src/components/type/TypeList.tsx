import type { Type } from "@models/Type.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePokedexContext } from "@providers/PokedexProvider.tsx";
import { Search } from "lucide-react";
import NewTypeForm from "@components/Forms/NewTypeForm.tsx";
import TypeListItem from "@components/type/TypeListItem.tsx";

interface ItemListProps {
  selectedType: Type | null;
  onTypeSelect: (type: Type) => void;
}

const TypeList = ({ selectedType, onTypeSelect }: ItemListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasScrolledToSelected, setHasScrolledToSelected] = useState(false);

  const { types } = usePokedexContext();

  const filteredTypes = useMemo(() => {
    return types.filter(
      (type) =>
        type.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [types, searchTerm]);

  const typeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedType && !hasScrolledToSelected) {
      // Use setTimeout to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        scrollToItem(selectedType.id, false); // false = instant scroll for initial positioning
        setHasScrolledToSelected(true);
      }, 100);

      return () => clearTimeout(timer);
    }
    return;
  }, [selectedType, hasScrolledToSelected]);

  useEffect(() => {
    if (selectedType && hasScrolledToSelected) {
      scrollToItem(selectedType.id, true); // true = smooth scroll for user interactions
    }
  }, [selectedType, hasScrolledToSelected]);

  useEffect(() => {
    if (searchTerm) {
      setHasScrolledToSelected(false);
    }
  }, [searchTerm]);

  const scrollToItem = (typeId: string, smooth: boolean = true) => {
    const itemElement = typeRefs.current[typeId];
    const containerElement = listContainerRef.current;

    if (itemElement && containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      const itemRect = itemElement.getBoundingClientRect();

      // Calculate scroll position to center the item in the container
      const scrollTop =
        itemElement.offsetTop - containerElement.offsetTop - containerRect.height / 2 + itemRect.height / 2;

      containerElement.scrollTo({
        top: scrollTop,
        behavior: smooth ? "smooth" : "auto"
      });
    }
  };

  const selectAndScrollToType = (type: Type) => {
    onTypeSelect(type);
  };

  const memoFilteredTypes = useMemo(() => filteredTypes.sort((a, b) => a.iconPosition - b.iconPosition), [filteredTypes]);

  return (
    <div className="w-80 bg-gradient-to-r from-slate-800/40 to-slate-800 flex flex-col">
      {/* Search Header */}
      <div className="p-4 flex items-center h-25 border-b-3 border-slate-700 shadow-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Types..."
              className="w-full pl-10 pr-4 py-2 border border-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300/70 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <NewTypeForm />
        </div>
      </div>

      {/* Type List */}
      <div ref={listContainerRef} className="flex-1 overflow-y-auto border-r-3 border-slate-700">
        {memoFilteredTypes.map((type) => (
          <TypeListItem
            key={type.id}
            type={type}
            selectedType={selectedType}
            typeRefs={typeRefs}
            selectAndScrollToType={selectAndScrollToType}
          />
        ))}
      </div>
    </div>
  );
};

export default TypeList;
