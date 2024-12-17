import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import Error from './components/Error.jsx';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [error,setError] = useState('');

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(()=> {
    async function fetchPlaces(){
      setisFetching(true);
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
      } catch (error) {
        setError({message: error.message || 'Failed to fetch user place.'});
      }
      setisFetching(false);
    }

    fetchPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

 async function handleSelectPlace(selectedPlace) {

    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
    }
 
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updateUserPlaces(updatePlaces.filter((place) => 
        place.id !== selectedPlace.current.id)
      );
    } catch (error) {
      setUserPlaces(updatePlaces);
    }
  
    setModalIsOpen(false);
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error Occurred!" message={error.message}/>}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          isLoading = {isFetching}
          loadingText="Feaching place data..."
          onSelectPlace={handleStartRemovePlace}
        />
        }
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
