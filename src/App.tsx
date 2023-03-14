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
const recordedInterval = [0, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15, 17];
const nodataInterval = ["No data"];
const blurOpacity = 0.1;

function App() {
  return (
    <main>
      <WorldMapProvider
        object="countries"
        width={width}
        height={height}
        margin={margin}
        strokeBold={strokeBold}
        strokeWidth={strokeWidth}
        blurOpacity={blurOpacity}
      >
        <DatasetProvider initialYear={2019} recordedInterval={recordedInterval}>
          <ColorLegendProvider
            nodataColor="white"
            strokeWidth={strokeWidth}
            widthPercent={widthPercent}
            colorLegendHeight={colorLegendHeight}
            colorLegendOffsetHeight={colorLegendOffsetHeight}
            colorLegendOffsetText={colorLegendOffsetText}
            spacing={spacing}
            strokeBold={strokeBold}
            recordedInterval={recordedInterval}
            nodataInterval={nodataInterval}
          >
            <WorldMap />
          </ColorLegendProvider>
        </DatasetProvider>
      </WorldMapProvider>
    </main>
  );
}

export default App;
