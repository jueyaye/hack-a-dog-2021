//Material UI Framework for Card
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    display: 'inline-block',
    margin: 10,
    "text-transform": 'capitalize'
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

function VersionCard(props:any) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        action={ (props.hasRemove) ?
            <IconButton aria-label="settings" onClick={() => props.handleFavouriteRemoved(props.index)}>
              <CancelIcon />
            </IconButton>
          : null
        }
        title={props.item.name}
        subheader={props.item.version}
      />
      <CardContent>
        <Typography variant="body2" component="p">
          Integration description
        </Typography>
      </CardContent>
    </Card>
  );
}

export default VersionCard