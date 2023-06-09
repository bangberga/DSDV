import {
  ChangeEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { styled } from "styled-components";
import { CgClose } from "react-icons/cg";
import { useDatasetContext } from "./providers/DatasetProvider";
import { useWorldMapContext } from "./providers/WorldMapProider";
import { useLineChartContext } from "./providers/LineChartProvider";

interface SelectCountriesProps {
  width: number;
  height: number;
}

export default function (props: SelectCountriesProps) {
  const { width, height } = props;
  const { groupedDatasetByCode, numericCodeByAlphaCode } = useDatasetContext();
  const {
    countryCodes,
    addCountry,
    removeCountry,
    clearCountries,
    show,
    showTable,
    closeTable,
  } = useLineChartContext();
  const { contryNameById } = useWorldMapContext();
  const [countries, setCountries] = useState<
    { name: string; alphaCode: string }[]
  >([]);
  const [search, setSearch] = useState<string>("");

  const id = useId();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      checked ? addCountry(value) : removeCountry(value);
    },
    [addCountry, removeCountry]
  );

  const filteredCountries = useMemo(
    () =>
      search
        ? countries.filter(({ name }) =>
            name.toLowerCase().includes(search.toLowerCase())
          )
        : countries,
    [countries, search]
  );

  const selectedCountries = useMemo(
    () => countries.filter(({ alphaCode }) => countryCodes.includes(alphaCode)),
    [countries, countryCodes]
  );

  useEffect(() => {
    if (!groupedDatasetByCode || !numericCodeByAlphaCode) return;
    const countries = Array.from(groupedDatasetByCode.keys()).map((code) => ({
      name: contryNameById.get(numericCodeByAlphaCode.get(code)!) || code,
      alphaCode: code,
    }));
    setCountries(countries);
  }, [groupedDatasetByCode, numericCodeByAlphaCode, contryNameById]);

  return (
    <Wrapper width={width} height={height} show={(show && showTable) + ""}>
      <header>
        <p>Choose data to show</p>
        <button onClick={closeTable}>
          <CgClose className="icon" />
        </button>
      </header>
      <div className="content">
        <div className="input-section">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleChange}
            value={search}
          />
          <div className="inputs">
            <div>
              {filteredCountries
                .slice(0, Math.ceil(filteredCountries.length / 2) + 1)
                .map(({ alphaCode, name }) => {
                  return (
                    <article key={alphaCode}>
                      <input
                        id={alphaCode}
                        type="checkbox"
                        value={alphaCode}
                        checked={countryCodes.includes(alphaCode)}
                        onChange={handleCheck}
                      />
                      <label htmlFor={alphaCode}>{name}</label>
                    </article>
                  );
                })}
            </div>
            <div>
              {filteredCountries
                .slice(Math.ceil(filteredCountries.length / 2) + 1)
                .map(({ alphaCode, name }) => {
                  return (
                    <article key={alphaCode}>
                      <input
                        id={alphaCode}
                        type="checkbox"
                        value={alphaCode}
                        checked={countryCodes.includes(alphaCode)}
                        onChange={handleCheck}
                      />
                      <label htmlFor={alphaCode}>{name}</label>
                    </article>
                  );
                })}
            </div>
          </div>
        </div>
        <aside>
          <div>
            {selectedCountries.map(({ alphaCode, name }) => {
              return (
                <article key={alphaCode + id}>
                  <input
                    id={alphaCode + id}
                    type="checkbox"
                    value={alphaCode}
                    checked={true}
                    onChange={handleCheck}
                  />
                  <label htmlFor={alphaCode + id}>{name}</label>
                </article>
              );
            })}
          </div>
          <button onClick={clearCountries}>
            <CgClose className="icon" /> Unselect all
          </button>
        </aside>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section<{ width: number; height: number; show: string }>`
  display: ${({ show }) => (show === "true" ? "block" : "none")};
  position: absolute;
  inset: 0;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 1rem;
  background: white;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid #ccc;
  box-shadow: 0 1px 5px lightgrey;
  input[type="checkbox"],
  label {
    cursor: pointer;
  }
  .icon {
    font-weight: 800;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    p {
      font-size: 2rem;
    }
    button {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
      cursor: pointer;
    }
  }
  .content {
    display: grid;
    grid-template-columns: 3fr 1fr;
    .input-section {
      input[type="text"] {
        width: 100%;
        border: 1px solid gray;
        height: 1.5rem;
        padding: 0 5px;
        margin-bottom: 0.5rem;
      }
      .inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        article {
          width: max-content;
        }
      }
    }
    aside {
      padding-left: 2rem;
      button {
        display: flex;
        align-items: center;
        margin-top: 1rem;
        border: none;
        font-size: 1rem;
        background: transparent;
        color: gray;
        &:hover {
          color: dodgerblue;
        }
      }
    }
  }
`;
