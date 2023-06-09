export default interface Dataset {
  Entity: string;
  Code: string;
  "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)": number;
  Year: number;
}
export type FilterKeysDataset<T> = keyof Pick<
  Dataset,
  { [K in keyof Dataset]: Dataset[K] extends T ? K : never }[keyof Dataset]
>;

export function instanceofDataset(data: unknown): data is Dataset {
  if (!data || typeof data !== "object") return false;
  return (
    "Entity" in data &&
    "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)" in data &&
    "Year" in data
  );
}

export type FilteredKeyDataset<F> = {
  [K in keyof Dataset]: Dataset[K] extends F ? K : never;
}[keyof Dataset];
