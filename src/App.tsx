import WorldMapProvider from "./components/providers/WorldMapProider";
import WorldMap from "./components/WorldMap";
import DatasetProvider from "./components/providers/DatasetProvider";
import ColorLegendProvider from "./components/providers/ColorLegendProvider";
import YearInput from "./components/YearInput";
import YearProvider from "./components/providers/YearProvider";
import Tooltip from "./components/Tooltip";
import TooltipProvider from "./components/providers/TooltipProvider";
import LineChartProvider from "./components/providers/LineChartProvider";
import LineChart from "./components/LineChart";
import SelectCountries from "./components/SelectCountries";
import BarChart from "./components/BarChart";
import RangeInput from "./components/RangeInput";
import Title from "./components/Title";
import AddButton from "./components/AddButton";
import SwitchButton from "./components/SwitchButton";

const width = 960;
const height = 480;
const marginWorldMap = { top: 0, left: 0, right: 0, bottom: 50 };
const widthPercent = 0.6;
const colorLegendHeight = 10;
const colorLegendOffsetHeight = 20;
const colorLegendOffsetText = 10;
const spacing = 50;
const recordedInterval = [0, 0.5, 1, 2.5, 5, 7.5, 10, 12.5, 15, 17];
const nodataInterval = ["No data"];
const startYear = 1990;
const endYear = 2019;

const marginTooltip = { top: 10, left: 30, right: 50, bottom: 20 };
const widthTooltip = 270;
const heightTooltip = 120;

const marginLineChart = { top: 20, left: 60, right: 80, bottom: 50 };

function App() {
  return (
    <main className="main">
      <WorldMapProvider
        object="countries"
        width={width}
        height={height}
        margin={marginWorldMap}
      >
        <DatasetProvider
          recordedInterval={recordedInterval}
          nodataInterval={nodataInterval}
        >
          <ColorLegendProvider
            nodataColor="white"
            widthPercent={widthPercent}
            colorLegendHeight={colorLegendHeight}
            colorLegendOffsetHeight={colorLegendOffsetHeight}
            colorLegendOffsetText={colorLegendOffsetText}
            spacing={spacing}
          >
            <YearProvider start={startYear} end={endYear}>
              <TooltipProvider
                x="Year"
                y="Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
                width={widthTooltip}
                height={heightTooltip}
                margin={marginTooltip}
              >
                <LineChartProvider
                  width={width}
                  height={height}
                  margin={marginLineChart}
                  x="Year"
                  y="Prevalence - HIV/AIDS - Sex: Both - Age: 15-49 years (Percent)"
                  g="Code"
                >
                  <Title
                    title="Share of population infected with HIV"
                    subTitle="The share of people aged 15 to 49 years old who are infected with HIV."
                  />
                  <section className="chart-container">
                    <WorldMap />
                    <YearInput width={width} />
                    <AddButton />
                    <LineChart />
                    <BarChart />
                    <RangeInput width={width} start={1990} end={2019} />
                    <SelectCountries width={width} height={height} />
                  </section>
                  <SwitchButton />
                  <Tooltip />
                </LineChartProvider>
              </TooltipProvider>
            </YearProvider>
          </ColorLegendProvider>
        </DatasetProvider>
      </WorldMapProvider>
    </main>
  );
}

export default App;
