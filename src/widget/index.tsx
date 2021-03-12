
import { useEffect, useState } from "react";

import { getRawAgentChangelog, parseRawAgentChangelog } from "../getAgentVersion";

import { getIntegrationNames, parseIntegrationNames } from "../getIntegrationVersion";

import { getRepos, filterRepos } from "../getAltRepos"

//Material UI Framework for Card
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    display: 'inline-block',
    margin: 10
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function Widget() {
  const [latestAgentVersion, setLatestAgentVersion] = useState("");
  const [latestReleseDate, setLatestReleseDate] = useState("");

  const [result, setResult] = useState([] as {name:string, version:string}[]);

  const classes = useStyles();

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
      console.log(res)

      filterRepos(res).then((repos:any) => {
        console.log(repos)
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
     
      {result.map((item, i) => (
            <Card className={classes.root}>
              <CardContent>
                <Typography className="none" color="textSecondary" gutterBottom>
                </Typography>
                <Typography variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Typography className="none" color="textSecondary">
                  {item.version}
                </Typography>
                <Typography variant="body2" component="p">
                  Integration description
                </Typography>
              </CardContent>
            </Card>
          ))
      }
    </section>
    
  );
}

export default Widget;
