import WorldMapProvider from "./components/providers/WorldMapProider";
import WorldMap from "./components/WorldMap";
import DatasetProvider from "./components/providers/DatasetProvider";
import ColorLegendProvider from "./components/providers/ColorLegendProvider";

const width = 960;
const height = 480;
const margin = { top: 0, left: 0, right: 0, bottom: 50 };
const strokeWidth = 0.2;
const widthPercent = 0.6;
const colorLegendHeight = 10;
const colorLegendOffsetHeight = 20;
const colorLegendOffsetText = 10;
const spacing = 50;
const strokeBold = 5;

function App() {
  return (
    <main>
      <WorldMapProvider
        object="countries"
        width={width}
        height={height}
        margin={margin}
      >
        <DatasetProvider initialYear={2019}>
          <ColorLegendProvider
            nodataColor="white"
            strokeWidth={strokeWidth}
            widthPercent={widthPercent}
            colorLegendHeight={colorLegendHeight}
            colorLegendOffsetHeight={colorLegendOffsetHeight}
            colorLegendOffsetText={colorLegendOffsetText}
            spacing={spacing}
            strokeBold={strokeBold}
          >
            <WorldMap />
          </ColorLegendProvider>
        </DatasetProvider>
      </WorldMapProvider>
    </main>
  );
}

export default App;
