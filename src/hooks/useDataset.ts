import { useQuery } from "@tanstack/react-query";
import { csv } from "d3";
import Dataset, { instanceofDataset } from "../interfaces/Dataset";

const csvUrl = new URL(
  "https://gist.githubusercontent.com/bangberga/cc84721f8cfdbc174ba1e8aea43fa3bd/raw/42949006b1354f5990c6c9cee2bbfce4fcc4441f/share-of-population-infected-with-hiv-ihme.csv"
);

export default function useDataset() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dataset"],
    queryFn: () =>
      csv(csvUrl.href, (data) => {
        if (instanceofDataset(data)) {
          data[
            "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
          ] =
            +data[
              "Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
            ];
          data["Year"] = +data["Year"];
        }
        return data;
      }),
  });

  return { dataset: data as Dataset[] | undefined, isLoading, isError };
}
