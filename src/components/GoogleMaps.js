import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
};

const libraries = ['places'];

const GoogleMaps = ({ onLocationChange, searchQuery, onSearchQueryChange }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center (India)
  const [markerPosition, setMarkerPosition] = useState(center);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };
          setCenter(currentLocation);
          setMarkerPosition(currentLocation);
          onLocationChange({ latitude, longitude });
        },
        () => {
          // Handle error or if user denies location access
          // The map will remain centered on the default location
          onLocationChange({ latitude: center.lat, longitude: center.lng });
        }
      );
    } else {
      // Geolocation not supported
      onLocationChange({ latitude: center.lat, longitude: center.lng });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const onMarkerDragEnd = (e) => {
    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setCenter(newPos); // Re-center the map on the new marker position
    setMarkerPosition(newPos);
    onLocationChange({ latitude: newPos.lat, longitude: newPos.lng });
  };

  const handlePlaceChanged = () => {
    const place = autocomplete?.getPlace();
    const location = place?.geometry?.location;

    if (!location) {
      return;
    }

    const newPos = {
      lat: location.lat(),
      lng: location.lng(),
    };
    setCenter(newPos);
    setMarkerPosition(newPos);
    onLocationChange(
      { latitude: newPos.lat, longitude: newPos.lng },
      place.formatted_address || place.name || ''
    );
  };

  if (loadError) {
    return <div>Error loading maps. Please check your API key and network connection.</div>;
  }

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <>
      <Autocomplete
        onLoad={setAutocomplete}
        onPlaceChanged={handlePlaceChanged}
        options={{ fields: ['formatted_address', 'geometry', 'name'] }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search for a location..."
          className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>
    </>
  );
};

export default React.memo(GoogleMaps);