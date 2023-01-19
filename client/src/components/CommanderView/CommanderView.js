import Banner from "../Banner/Banner";
import Entry from "./Entry";
import axios from "axios";

export default function CommanderView() {
  const config = {
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
  };
  const data = {};
  axios.post(process.env.REACT_APP_uri + "/api/req", data, config).then(function(res){console.log(res);});
  return (
    <div className="flex flex-col w-11/12 ml-auto mr-0">
      <Banner title={"View Decks"} enableSearchbar={true} enableColors={true} />
      <div className="px-24 py-12">
        <Entry rank={1} name="Tymna/Kraum" colors={["W", "U", "B", "R"]} />
      </div>
    </div>
  );
}