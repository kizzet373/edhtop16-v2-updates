import { useEffect, useMemo, useState } from "react";
import { createSearchParams, useNavigate, useParams} from "react-router-dom";
import { RxCaretSort, RxChevronDown } from "react-icons/rx";
import axios from "axios";

import Banner from "../Banner/Banner";
import Entry from "../Entry";
import { getCommanders, sortEntries } from "../../data/Commanders";
import moment from "moment";
import { compressObject, insertIntoObject } from "../../utils";

const TERMS = [
  {
    name: "Standing",
    tag: "standing",
    cond: [
      {
        $lte: `Top X:`, 
        component: "select",
        type: 'number',
        values: [
          {
            value: null,
            name: 'Filter By Top X',
            disabled: true,
            selected: true
          },
          {
            value: 1,
            name: 'Top 1'
          },
          {
            value: 4,
            name: 'Top 4'
          },
          {
            value: 16,
            name: 'Top 16'
          },
          {
            value: 32,
            name: 'Top 32'
          },
          {
            value: 64,
            name: 'Top 64'
          },
        ]
      },
      // { $eq: `is equal to (=)`, type: "number" },
      // { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Wins",
    tag: "wins",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Losses",
    tag: "losses",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Draws",
    tag: "draws",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
  {
    name: "Win Rate",
    tag: "winRate",
    cond: [
      { $gte: `is greater than (\u2265)`, type: "number" },
      { $eq: `is equal to (=)`, type: "number" },
      { $lte: `is less than (\u2264)`, type: "number" },
    ],
  },
]


export default function SingleTournamentView(){
  const {TID} = useParams();

  const defaultFilters = {
    tourney_filter: {
      TID: TID
    }
  };

  const loadFilters = useMemo(() => {
    const params = new URLSearchParams(window.location.search)

    let generated_filters = {
    }
    params.forEach((val, key) => {
      generated_filters = insertIntoObject(generated_filters, key.split('__'), val)
    })

    return Object.entries(generated_filters).length > 0 ? generated_filters : defaultFilters;
  }, [])

  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(loadFilters);
  const [allFilters, setAllFilters] = useState(loadFilters);
  const [sort, setSort] = useState("standing");
  const [toggled, setToggled] = useState(false);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_uri + "/api/req", defaultFilters)
      .then((res) => {
        console.log(defaultFilters, res.data, res.data.length > 0);
        // if (res.data.length > 0) {
        //   setCommanderExist(true);
        // } else {
        //   setCommanderExist(false);
        // }
      });
  }, [defaultFilters]);

  function getFilters(data) {
    setFilters(data);
  }

  /**
 * Changes the sort order
 */
  function handleSort(x) {
    // console.log("sort", x);
    setSort(x);
    if (x === sort) {
      setToggled(!toggled);
    }
  }

  useEffect(() => {
    // Deep copy b/c useState needs a new object
    const entries_copy = JSON.parse(JSON.stringify(entries));
    const sortedEntries = sortEntries(entries_copy, sort, toggled);
    setEntries(sortedEntries);
    setIsLoading(false);
  }
  , [sort, toggled]);

  useEffect(() => {
    console.log("getCommanders useEffect allFilters:", allFilters);
    getCommanders(allFilters).then((data) =>{
      const sortedEntries = sortEntries(data, sort, toggled);
      setEntries(sortedEntries);
      setIsLoading(false);
    });
  }, [allFilters]);

  return (
    <div className="flex flex-col flex-grow overflow-auto">
      <Banner
        title={'View Tournaments'}
        enableFilters={true}
        getFilters={getFilters}
        allFilters={allFilters}
        defaultFilters={defaultFilters}
        terms={TERMS}
        enablecolors={false}
        backEnabled
      />

      <table className="mx-2 md:mx-6 my-2 border-spacing-y-3 border-separate">
        <thead className="hidden md:table-row-group [&>tr>td>p]:cursor-pointer [&>tr>td]:px-4">
          <tr className="text-subtext dark:text-white text-lg ">
            <td className="font-bold">#</td>
            <td>
              <p
                onClick={() => handleSort("name")}

                className="flex flex-row items-center gap-1 font-bold"
              >
                Player Name

                {sort === "name" ? (
                  <RxChevronDown
                    className={`${toggled ? "" : "rotate-180"
                      } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
              </p>
            </td>
            <td>
              <p 
                onClick={() => handleSort("wins")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Wins
                  
                {sort === "wins" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
                  </p>
            </td>
            <td>
              <p onClick={() => handleSort("losses")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Losses
                  
                {sort ==="losses" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
                  </p>
            </td>
            <td>
              <p onClick={() => handleSort("draws")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Draws
                  
                {sort ==="draws" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
                  </p>
            </td>
            <td>
              <p onClick={() => handleSort("winrate")}
                
                className="flex flex-row items-center gap-1 font-bold"
                >
                  Winrate
                  
                {sort ==="winrate" ? (
                  <RxChevronDown
                    className={`${
                      toggled ? "" : "rotate-180"
                    } transition-all duration-200k`}
                  />
                ) : (
                  <RxCaretSort
                    className={`text-lightText dark:text-text transition-all duration-200k`}
                  />
                )}
                  </p>
            </td>
          </tr>
        </thead>
        <tbody className="[&>tr>td>p]:cursor-pointer [&>tr>td]:px-4 md:[&>tr>td]:px-4 [&>tr]:my-3 ">
          {isLoading ? (
            <tr className="text-text text-lg">Loading...</tr>
          ) : (
            entries && entries.length === 0 ? <div className="w-full flex justify-center items-center text-accent dark:text-text font-bold text-2xl">No data available</div> :
              entries.map((entry, i) => (
                <Entry
                  rank={entry.standing}
                  name={entry.name}
                  mox={entry.decklist}
                  metadata={[
                    entry.wins,
                    entry.losses,
                    entry.draws,
                    Number(entry.winRate  * 100).toFixed(2) + "%",
                  ]}
                  layout="WLD"
                  metadata_fields={['Wins', 'Losses', 'Draws', 'Win rate']} 
                  filters={allFilters}
                />
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}
