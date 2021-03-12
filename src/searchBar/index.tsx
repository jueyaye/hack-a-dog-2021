/* eslint-disable no-use-before-define */
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function SearchBar(props:any) {
  const onSelect = (option:any) => {
    props.handleFavouriteSelected(option)
  }

  return (
    <Autocomplete
      options={props.options}
      getOptionLabel={(option:{name: string}) => option.name}
      title='search'
      renderInput={(params) => <TextField {...params} label="Search Datadog" variant="outlined" />}
      onChange={(event, value) => onSelect(value)}
    />
  );
}

export default SearchBar