import { useQuery } from "@tanstack/react-query";
import { csv } from "d3";
import Code from "../interfaces/Code";

const csvUrl = new URL(
  "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.csv"
);

export default function useCode() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["codes"],
    queryFn: () => csv(csvUrl.href),
  });
  return { codes: data as Code[] | undefined, isLoading, isError };
}
