import { defaultType, type Type } from "@models/Type.ts";

export const importTypes = (data: string) => {
  const sections: string[] = data.split("#-------------------------------");
  const typesList: Type[] = [];

  if (data.includes("Pokedex") || data.includes("TotalPP")) {
    throw new Error("Invalid Types data format.");
  }

  let lineNum = 0;

  sections.forEach((section) => {
    const lines = section.split("\n");
    const type: Type = structuredClone(defaultType);

    lines.forEach((line) => {
      if (line.trim() === "" || line.startsWith("#")) return; // Skip empty lines and comments

      line = line.trim();
      if (line.startsWith("[") && line.endsWith("]")) {
        type.id = line.slice(1, -1);
        return;
      }

      const [key, value] = line.split("=").map((s) => s.trim());

      switch (key) {
        case "Name":
          type.name = value;
          break;
        case "IconPosition":
          type.iconPosition = parseInt(value, 10);
          break;
        case "Weaknesses":
          type.weaknesses = value
            .split(",")
            .filter((w) => w !== "")
            .map((t) => t.trim());
          break
        case "Resistances":
          type.resistances = value
            .split(",")
            .filter((w) => w !== "")
            .map((t) => t.trim());
          break;
        case "Immunities":
          type.immunities = value
            .split(",")
            .filter((w) => w !== "")
            .map((t) => t.trim());
          break;
        case "IsSpecialType":
          type.isSpecialType = value === "true";
          break;
        case "IsPseudoType":
          type.isPseudoType = value === "true";
          break;
      }

      lineNum++;
    });

    if (typesList.some((t) => t.id === type.id)) {
      console.warn(`Duplicate type found: ${type.name}`);
    }

    if (!type.id || type.id.trim() === "[]") {
      return;
    }

    typesList.push(type);
  });

  console.log(`Parsed ${typesList.length} types from internal PBS.`);
  return typesList;
};
