export interface Type {
  id: string;
  name: string;
  iconPosition: number;
  weaknesses: string[];
  immunities: string[];
  resistances: string[];
  isSpecialType: boolean;
  isPseudoType: boolean;
  color: string;
}

export const defaultType: Type = {
  id: "",
  name: "",
  iconPosition: 0,
  weaknesses: [],
  immunities: [],
  resistances: [],
  isPseudoType: false,
  isSpecialType: false,
  color: "",
}
