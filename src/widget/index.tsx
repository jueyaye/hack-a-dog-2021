import { useEffect, useState } from "react";

// helpers
import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";
import { getIntegrationNames, parseIntegrationNames } from "../getIntegrationVersion";
import { getRepos, filterRepos } from "../getAltRepos"

// components
import VersionCard from "../versionCard"
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SearchBar from "../searchBar"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'inline-block'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));



function Widget() {
  const classes = useStyles();

  const [favourites, setFavourites] = useState([] as {name:string, version:string}[]);

  const [listOfAgents, setListOfAgents] = useState([] as {name:string, version:string}[]);
  const [listOfAgentIntegrations, setListOfAgentIntegrations] = useState([] as {name:string, version:string}[]);
  const [listOfTracers, setListOfTracers] = useState([] as {name:string, version:string}[]);
  const [listOfRUMSDKs, setListOfRUMSDKs] = useState([] as {name:string, version:string}[]);
  const [listOfAWSPackages, setListOfAWSPackages] = useState([] as {name:string, version:string}[]);
  const [listOfKubePackages, setListOfKubePackages] = useState([] as {name:string, version:string}[]);
  const [listOfAPIClients, setListOfAPIClients] = useState([] as {name:string, version:string}[]);


  useEffect(() => {
    try {
      const stashedFavourites = localStorage.getItem('favourites');

      if (stashedFavourites) setFavourites(JSON.parse(stashedFavourites as string))
    } catch(err) {
      console.log('No favourites saved...')
    }

    // getRawAgentChangelog().then((res:JSON) => {
    //   const { latestAgentVersion, latestReleseDate } = parseRawAgentChangelog(res);
    // })

    getIntegrationNames().then((res:JSON) => {
      const { listOfIntegrationObjs } = parseIntegrationNames(res);

      setListOfAgentIntegrations(listOfIntegrationObjs)

    })

    getRepos(1).then((res:any) => {
      filterRepos(res).then((repos:any) => {
        // override state with local variable
        let listOfAgents = new Array()
        let listOfTracers = new Array()
        let listOfRUMSDKs = new Array()
        let listOfAWSPackages = new Array()
        let listOfKubePackages = new Array()
        let listOfAPIClients = new Array()

        for (var i = 0; i < repos.agent.length; i++) {
          if (repos.agent[i].release != null) {
            if (repos.agent[i].release.tag_name != null)
              listOfAgents.push({name: repos.agent[i].name, version: repos.agent[i].release.tag_name})
          }
        }
        setListOfAgents(listOfAgents)

        //tacers
        for (var i = 0; i < repos.tracer.length; i++) {
          if (repos.tracer[i].release != null) {
            if (repos.tracer[i].release.tag_name != null)
              listOfTracers.push({name: repos.tracer[i].name, version: repos.tracer[i].release.tag_name})
          }
        }
        setListOfTracers(listOfTracers)

        //rum sdk
        for (var i = 0; i < repos.rum.length; i++) {
          if (repos.rum[i].release != null) {
            if (repos.rum[i].release.tag_name != null)
              listOfRUMSDKs.push({name: repos.rum[i].name, version: repos.rum[i].release.tag_name})
          }
        }
        setListOfRUMSDKs(listOfRUMSDKs)

        //aws packages
        for (var i = 0; i < repos.aws.length; i++) {
          if (repos.aws[i].release != null) {
            if (repos.aws[i].release.tag_name != null)
              listOfAWSPackages.push({name: repos.aws[i].name, version: repos.aws[i].release.tag_name})
          }
        }
        setListOfAWSPackages(listOfAWSPackages)

        //kube packages
        for (var i = 0; i < repos.kube.length; i++) {
          if (repos.kube[i].release != null) {
            if (repos.kube[i].release.tag_name != null)
            listOfKubePackages.push({name: repos.kube[i].name, version: repos.kube[i].release.tag_name})
          }
        }
        setListOfKubePackages(listOfKubePackages)

        //API clients
        for (var i = 0; i < repos.api.length; i++) {
          if (repos.api[i].release != null) {
            if (repos.api[i].release.tag_name != null)
              listOfAPIClients.push({name: repos.api[i].name, version: repos.api[i].release.tag_name})
          }
        }
        setListOfAPIClients(listOfAPIClients)
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
      <SearchBar options={[
        ...listOfAgents, 
        ...listOfTracers, 
        ...listOfAWSPackages,
        ...listOfRUMSDKs,
        ...listOfKubePackages,
        ...listOfAPIClients
      ]} handleFavouriteSelected={handleFavouriteSelected}/>
      { favourites.map((item, i) => (
        <VersionCard item={item} hasRemove={true} index={i} handleFavouriteRemoved={handleFavouriteRemoved}/>
      )) }
      <h2>Agent Versions</h2>
      <p>Here is a list of the latest Agent versions.</p>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Click here...</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
          <VersionCard item={{name: 'Datadog Agent', version: latestAgentVersion}} hasRemove={false}/>
        </AccordionDetails>
      </Accordion> 
      
      <h2>Integration Versions</h2>
      <p>Here is a list of the latest Integration versions.</p>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Click here...</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
          { listOfAgentIntegrations.map((item, i) => (
            <VersionCard item={item} hasRemove={false}/>
          )) }
        </AccordionDetails>
      </Accordion>  
  

    <h2>Tracer Versions</h2>
    <p>Here is a list of the latest Tracer versions.</p>
    
    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Click here...</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
        { listOfTracers.map((item, i) => (
          <VersionCard item={item} hasRemove={false}/>
        )) }
        </AccordionDetails>
    </Accordion>  

    <h2>RUM SDK Versions</h2>
    <p>Here is a list of the latest RUM SDK versions.</p>
    

    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Click here...</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
        { listOfRUMSDKs.map((item, i) => (
          <VersionCard item={item} hasRemove={false}/>
        )) }
        </AccordionDetails>
      </Accordion>  

    <h2>AWS Package Versions</h2>
    <p>Here is a list of the latest AWS Package versions.</p>
    

    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Click here...</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
        { listOfAWSPackages.map((item, i) => (
          <VersionCard item={item} hasRemove={false}/>
        )) }
        </AccordionDetails>
    </Accordion>  

    <h2>Kube Package Versions</h2>
    <p>Here is a list of the latest Kube package versions.</p>
    

<Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Click here...</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
        { listOfKubePackages.map((item, i) => (
      <VersionCard item={item} hasRemove={false}/>
    )) }
        </AccordionDetails>
      </Accordion>  

    <h2>API Client Package Versions</h2>
    <p>Here is a list of the latest API Client versions.</p>
    

    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Click here...</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.root}>
        { listOfAPIClients.map((item, i) => (
          <VersionCard item={item} hasRemove={false}/>
        )) }
        </AccordionDetails>
      </Accordion>  

    </section>
    
  );
}

export default Widget;
