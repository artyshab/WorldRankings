import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";

type Country = {
  name: {
    official: string;
  };
  population: number;
  area: number;
  region: string;
  flags: {
    svg: string;
  };
};

export default function Countries() {
  const [data, setData] = useState<Country[]>([]);

  const [searchTerm, setSearch] = useState<string>("");
  const [option, setOption] = useState<string>("population");
  const [region , setRegion] = useState<string>("");
 
  const filterData = data
    .filter((country) => {
      const searchedData =
      searchTerm === "" ||
      country.name.official.toLowerCase().includes(searchTerm) ||
      country.region.toLowerCase().includes(searchTerm)
       
      const regionData = region === "" || country.region.toLowerCase() === region.toLowerCase();
      return searchedData && regionData;
    })
    .sort((a, b) => {
      if (option === "population") {
        return b.population - a.population;
      } else if (option === "a-z") {
        return a.name.official.localeCompare(b.name.official);
      } else if (option === "area") {
        return b.area - a.area;
      }
      return 0;
    });

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countriesData = response.data.map((country: Country) => ({
          name: country.name,
          population: country.population,
          area: country.area,
          region: country.region,
          flags: country.flags,
        }));
        setData(countriesData);
      })
      .catch((error) => {
        console.error("Error during axios fetch:", error);
      });
  }, []);

  return (
    <>
      <div className="countries-container">
        <div className="info">
          <div className="number">
            <p>Found {data.length} countries</p>
          </div>
          <div className="search-countries">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              id="search-input"
              placeholder="Search by Name,Region,Subregion"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="display-countries">
          <div className="sidebar">
            <div className="sort">
              <label>Sort by</label>
              <select
                name=""
                id=""
                onChange={(e) => {
                  setOption(e.target.value);
                }}
              >
                <option value="population">Population</option>
                <option value="a-z">A-Z index</option>
                <option value="area">Area</option>
              </select>
            </div>
            <div className="region">
              <label>Region</label>
              <div className="regions">
                <p onClick={() => setRegion("Americas")}>Americas</p>
                <p onClick={() => setRegion("Europe")}>Europe</p>
                <p onClick={() => setRegion("Asia")}>Asia</p>
                <p onClick={() => setRegion("Africa")}>Africa</p>
                <p onClick={() => setRegion("Antarctic")}>Antarctic</p>
              </div>
            </div>
          </div>
          <div className="show-countries">
            <div className="countries-info">
              <p>Flag</p>
              <p>Name</p>
              <p>Population</p>
              <p>Area (km²)</p>
              <p>Region</p>
            </div>
            <div className="countries">
              {filterData.map((country, index) => (
                <div key={index} className="country">
                  <img
                    src={country.flags.svg}
                    alt={`${country.name.official} flag`}
                    style={{ width: "65px" }}
                  />
                  <p>{country.name.official}</p>
                  <p>{country.population.toLocaleString()}</p>
                  <p>{country.area.toLocaleString()} km²</p>
                  <p>{country.region}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
