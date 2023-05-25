import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { requestCall } from '../api/cities';
import { useEffect, useState } from 'react';
import axios from 'axios';
export default Cities = () => {  
  useEffect(() => {
    const asyncFunc = async() => {
      let data = await requestCall();
      //cityData.push(data);
      //setCityData(cityData);
    }
    asyncFunc();
  } ,[]
  )


  const [localMonth, setLocalMonth] = useState('');
  const [localData, setLocalData] = useState('');
  const[cityData, setCityData] = useState([]);
  
  
  const handleSubmit = async () => {
    const city = localData;
    const month = localMonth;
  
    try {
      const response = await axios.get(`api/campaign/sunshine?city=${city}&month=${month}`);
      const element = {
        city: city,
        month: month,
        sunpercentage: response.data.sunshine_percent // Use response.data to access the response data
      };
  
      setCityData(prevData => [...prevData, element]); // Create a new array with the updated data
      console.log(cityData);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    //<input value = {comp} onChange={(e) => setValue(e.currentTarget.value)}></input>
    <div>
    <ListGroup>
      {cityData.length !== 0 ? (
        cityData.map((element) => (
          <ListGroupItem key={element.sunpercentage}>
            {element.city}, {element.month}, {element.sunpercentage}
          </ListGroupItem>
        ))
      ) : null}
    </ListGroup>
    <input value = {localData} onChange={(e) => setLocalData(e.currentTarget.value)} placeholder='City'></input>
    <input value = {localMonth} onChange={(e) => setLocalMonth(e.currentTarget.value)} placeholder='Month'></input>
    <Button onClick={handleSubmit}>Submit Local Data</Button>
    </div>
  );
      
}



/*


## Problem 1

Create a new api called `sunshine` in `campaignRoutes` that accepts query parameters `month` and `city` and returns the sunshine percentage of that city for the given month.
If only `month` is provided, the API should return the percentages for the city for all months. If `city` is not provided, the percentages of all cities for the given month should be returned.

`localhost:3000/campaign/sunshine?city=austin&month=november`

For the data, you can use the `/backend/data/us_sunshine.csv` file.

## Problem 2

Provide a method to search for a city or month in the UI in the `Cities.jsx` and display the returned data from the sunshine api.

## Problem 3

Include population, state, longitude, and latitude in the data returned from sunshine api. For the data, use `/backend/data/us-cities-top-1k.csv`


*/