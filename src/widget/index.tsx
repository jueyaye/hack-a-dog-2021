import { useEffect, useState } from "react";

// helpers
import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";
import { getIntegrationNames, parseIntegrationNames } from "../getIntegrationVersion";
import { getRepos, filterRepos } from "../getAltRepos"

// components
import VersionCard from "../versionCard"
import SearchBar from "../searchBar"

function Widget() {
  const [latestAgentVersion, setLatestAgentVersion] = useState("");
  const [latestReleseDate, setLatestReleseDate] = useState("");

  const [favourites, setFavourites] = useState([] as {name:string, version:string}[]);

  const [result, setResult] = useState([] as {name:string, version:string}[]);

  useEffect(() => {
    try {
      const stashedFavourites = localStorage.getItem('favourites');

      if (stashedFavourites) setFavourites(JSON.parse(stashedFavourites as string))
    } catch(err) {
      console.log('No favourites saved...')
    }


    getRawAgentChangelog().then((res:JSON) => {
      const { latestAgentVersion, latestReleseDate } = parseRawAgentChangelog(res);

      setLatestAgentVersion(latestAgentVersion);
      setLatestReleseDate(latestReleseDate);
    })

    getIntegrationNames().then((res:JSON) => {
      const { listOfIntegrationObjs } = parseIntegrationNames(res);

      setResult(listOfIntegrationObjs)

    })

    getRepos(1).then((res:any) => {
      filterRepos(res).then((repos:any) => {
        console.log(repos)
      })
    })
  }, []);

  const handleFavouriteSelected = (option:any) => {
    const temp = favourites.concat(option);

    localStorage.setItem('favourites', JSON.stringify(temp));
    setFavourites(temp)
  }

  const handleFavouriteRemoved = (index:number) => {
    const temp = [...favourites]
    temp.splice(index, 1)
    
    localStorage.setItem('favourites', JSON.stringify(temp));
    setFavourites(temp)
  }

  return (
    <section style={{ padding: "10px" }}>
      <h2>Favourites</h2>
      <p>Search and save your most used Datadog services</p>
      <SearchBar options={[...result]} handleFavouriteSelected={handleFavouriteSelected}/>
      { favourites.map((item, i) => (
        <VersionCard item={item} hasRemove={true} index={i} handleFavouriteRemoved={handleFavouriteRemoved}/>
      )) }
      <h2>Agent Versions</h2>
      <p>Latest Datadog Agent version: {latestAgentVersion}</p>
      <p> Released on: {latestReleseDate}</p>
      <h2>Integration Versions</h2>
      <p>Here is a list of the latest integration versions.</p>
     
      { result.map((item, i) => (
        <VersionCard item={item} hasRemove={false}/>
      )) }

    </section>
    
  );
}

export default Widget;
