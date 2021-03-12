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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function Widget() {
  const classes = useStyles();

  const [latestAgentVersion, setLatestAgentVersion] = useState("");
  const [latestReleseDate, setLatestReleseDate] = useState("");

  const [result, setResult] = useState([] as {name:string, version:string}[]);
  const [listOfTracers, setListOfTracers] = useState([] as {name:string, version:string}[]);

  useEffect(() => {
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
      //console.log(res)

      filterRepos(res).then((repos:any) => {
        var listOfTracers = new Array()
        console.log("complete repo: ")
        console.log(repos.tracer)
        for (var i = 0; i < repos.tracer.length; i++) {
          if (repos.tracer[i].release != null) {
            if (repos.tracer[i].release.tag_name != null)
              listOfTracers.push({name: repos.tracer[i].name, version: repos.tracer[i].release.tag_name})
          }
        }
        //console.log(listOfTracers)
        setListOfTracers(listOfTracers)
      })
    })

  
  }, []);

  return (
    <section style={{ padding: "10px" }}>
      <h2>Agent Versions</h2>
      <p>Latest Datadog Agent version: {latestAgentVersion}</p>
      <p> Released on: {latestReleseDate}</p>
      <h2>Integration Versions</h2>
      <p>Here is a list of the latest integration versions.</p>
      <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          //expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          { result.map((item, i) => (
            <VersionCard item={item}/>
          )) }
        </AccordionDetails>
      </Accordion>  
    </div>

      

      <h2>Tracer Versions</h2>
      <p>Here is a list of the latest Tracer versions.</p>
      { listOfTracers.map((item, i) => (
        <VersionCard item={item}/>
      )) }
    </section>
    
  );
}

export default Widget;
