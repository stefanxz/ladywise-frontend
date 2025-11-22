import { factorsRegistry } from "./factorsRegistry";

export function mapBackendToFactors(backend: any) {
  // 1. Clone ALL default factor definitions
  const output: any = {};

  Object.entries(factorsRegistry).forEach(([id, def]) => {
    output[id] = {
      id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      present: false,
      value: null,
    };
  });

  // 2. Apply backend data safely
  if (backend) {
    Object.entries(backend).forEach(([key, value]) => {
      if (!output[key]) return;

      if (typeof value === "boolean") {
        output[key].present = value;
      } else if (typeof value === "string") {
        output[key].present = true;
        output[key].value = value;
      }
    });
  }

  return output;
}