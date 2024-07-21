import React, { useEffect, useRef } from 'react';

const MapComponent = ({ firmLatitude, firmLongitude, consulateLocations }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: firmLatitude, lng: firmLongitude },
      zoom: 12,
    });

    new window.google.maps.Marker({
      position: { lat: firmLatitude, lng: firmLongitude },
      map,
      title: 'Visa Firm',
    });

    consulateLocations
      .filter(location => location.latitude && location.longitude) // Check for valid locations
      .forEach((location, index) => {
        new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map,
          title: `Consulate ${index + 1}`,
        });
      });
  }, [firmLatitude, firmLongitude, consulateLocations]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
