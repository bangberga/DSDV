import { ReactNode, createContext, useContext } from "react";

interface ColorLegendProviderProps {
  children: ReactNode | undefined;
  nodataColor: string;
  widthPercent: number;
  colorLegendHeight: number;
  colorLegendOffsetHeight: number;
  colorLegendOffsetText: number;
  spacing: number;
}

interface ColorLegendContextProps {
  nodataColor: string;
  widthPercent: number;
  colorLegendHeight: number;
  colorLegendOffsetHeight: number;
  colorLegendOffsetText: number;
  spacing: number;
}

const ColorLegendContext = createContext<ColorLegendContextProps>({
  nodataColor: "white",
  widthPercent: 0,
  colorLegendHeight: 0,
  colorLegendOffsetHeight: 0,
  colorLegendOffsetText: 0,
  spacing: 0,
});

export default function ColorLegendProvider(props: ColorLegendProviderProps) {
  const {
    children,
    nodataColor,
    widthPercent,
    colorLegendHeight,
    colorLegendOffsetText,
    colorLegendOffsetHeight,
    spacing,
  } = props;

  return (
    <ColorLegendContext.Provider
      value={{
        nodataColor,
        widthPercent,
        colorLegendHeight,
        colorLegendOffsetHeight,
        colorLegendOffsetText,
        spacing,
      }}
    >
      {children}
    </ColorLegendContext.Provider>
  );
}

export function useColorLegendContext() {
  return useContext<ColorLegendContextProps>(ColorLegendContext);
}
