import { useState, useEffect } from 'react';
import Places from './Places.jsx';
import ErrorPage from './Error.jsx';
import { sortPlacesByDistance }  from '../loc.js';
import { fetchAvilablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {

  const[availablePlaces, setAviablePlaces] = useState([]);
  const[isFetching, setisFetching] = useState(false);
  const[error,setError] = useState();

  
    useEffect(() => {
      async function fetchPlaces(){
        setisFetching(true);
        try {
          
          const places = await fetchAvilablePlaces();

          navigator.geolocation.getCurrentPosition((position) => {

            const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);

            setAviablePlaces(places);
            setisFetching(false);
          });
          
        } catch (error) {
          setError(error);
        }
  
    //  setisFetching(false);
      }
    
      fetchPlaces();
    }, []);
    
    if (error) {    
      return <ErrorPage title="An error occurred!" message={error.message} />;
    }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      fallbackText="No places available."
      isLoading={isFetching}
      loadingText="Feaching place data..."
      onSelectPlace={onSelectPlace}
    />
  );
}
