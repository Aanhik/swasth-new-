import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Clinic {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  openingHours?: string;
  emergency?: string;
  wheelchair?: string;
  beds?: string;
  speciality?: string;
  type?: string;
}

export default function InstantMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [refreshingLocation, setRefreshingLocation] = useState(false);

  // Fix for marker icon path
  const customIcon = L.icon({
    iconUrl: '/images/marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('📍 Your exact location:', { latitude, longitude });
          console.log('🎯 Accuracy:', position.coords.accuracy, 'meters');
          initMap(latitude, longitude);
          fetchClinics(latitude, longitude);
        },
        (err) => {
          console.error('❌ Geolocation error:', err.message);
          // Default to Asansol, West Bengal coordinates
          const defaultLat = 23.6739;
          const defaultLon = 86.9524;
          console.log('📍 Using default location: Asansol');
          initMap(defaultLat, defaultLon);
          fetchClinics(defaultLat, defaultLon);
          setError('Unable to get your precise location. Showing Asansol area.');
        },
        {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 10000, // 10 second timeout
          maximumAge: 0 // Don't use cached position
        }
      );
    } else {
      // Default location if geolocation not supported
      const defaultLat = 23.6739;
      const defaultLon = 86.9524;
      console.log('📍 Geolocation not supported, using Asansol');
      initMap(defaultLat, defaultLon);
      fetchClinics(defaultLat, defaultLon);
      setError('Geolocation not supported. Showing Asansol area.');
    }
  }, []);

  function initMap(lat: number, lon: number) {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current).setView([lat, lon], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user location marker
    L.marker([lat, lon], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(map).bindPopup('Your Location').openPopup();

    leafletMapRef.current = map;
  }

  async function fetchClinics(lat: number, lon: number) {
    setLoading(true);
    setError(null);

    try {
      // Using Overpass API to find clinics and hospitals
      const radius = 5000; // 5km radius
      const query = `
        [out:json];
        (
          node["amenity"="clinic"](around:${radius},${lat},${lon});
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          node["amenity"="doctors"](around:${radius},${lat},${lon});
          way["amenity"="clinic"](around:${radius},${lat},${lon});
          way["amenity"="hospital"](around:${radius},${lat},${lon});
          way["amenity"="doctors"](around:${radius},${lat},${lon});
        );
        out center;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clinics');
      }

      const data = await response.json();
      const clinicList: Clinic[] = data.elements.map((element: any) => {
        const clinicLat = element.lat || element.center?.lat;
        const clinicLon = element.lon || element.center?.lon;
        const tags = element.tags || {};

        // Build full address
        const addressParts = [
          tags['addr:housenumber'],
          tags['addr:street'],
          tags['addr:city'] || tags['addr:district'],
          tags['addr:postcode'],
        ].filter(Boolean);
        
        const fullAddress = tags['addr:full'] || addressParts.join(', ') || 'Address not available';

        // Determine facility type
        let facilityType = 'Medical Facility';
        if (tags.amenity === 'hospital') facilityType = 'Hospital';
        else if (tags.amenity === 'clinic') facilityType = 'Clinic';
        else if (tags.amenity === 'doctors') facilityType = 'Doctor\'s Office';

        return {
          id: element.id.toString(),
          name: tags.name || tags.official_name || `Unnamed ${facilityType}`,
          lat: clinicLat,
          lon: clinicLon,
          address: fullAddress,
          phone: tags.phone || tags['contact:phone'] || tags['phone:mobile'] || tags.mobile || 'Not available',
          website: tags.website || tags['contact:website'] || tags.url || null,
          email: tags.email || tags['contact:email'] || null,
          openingHours: tags.opening_hours || tags.hours || null,
          emergency: tags.emergency === 'yes' ? 'Yes' : tags.emergency === 'no' ? 'No' : null,
          wheelchair: tags.wheelchair || null,
          beds: tags.beds || tags.capacity || null,
          speciality: tags.healthcare || tags['healthcare:speciality'] || tags.speciality || null,
          type: facilityType,
        };
      }).filter((clinic: Clinic) => clinic.lat && clinic.lon);

      setClinics(clinicList);
      addMarkersToMap(clinicList);
    } catch (err) {
      console.error('Error fetching clinics:', err);
      setError('Failed to load nearby clinics. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function addMarkersToMap(clinicList: Clinic[]) {
    if (!leafletMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    clinicList.forEach((clinic) => {
      if (!leafletMapRef.current) return;

      const marker = L.marker([clinic.lat, clinic.lon], { icon: customIcon })
        .addTo(leafletMapRef.current);

      // Create popup content with card
      const popupContent = `
        <div style="min-width: 250px; max-width: 350px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; margin: -12px -12px 12px -12px; border-radius: 8px 8px 0 0;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600;">
              ${clinic.name}
            </h3>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">
              ${clinic.type}
            </p>
          </div>
          <div style="font-size: 13px; color: #374151; line-height: 1.6;">
            <div style="margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
              <span style="font-size: 16px;">📍</span>
              <div>
                <strong>Address:</strong><br/>
                <span style="color: #6b7280;">${clinic.address}</span>
              </div>
            </div>
            
            <div style="margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
              <span style="font-size: 16px;">📞</span>
              <div>
                <strong>Phone:</strong><br/>
                <span style="color: ${clinic.phone === 'Not available' ? '#dc2626' : '#059669'};">
                  ${clinic.phone}
                </span>
              </div>
            </div>
            
            ${clinic.website ? `
              <div style="margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="font-size: 16px;">🌐</span>
                <div>
                  <strong>Website:</strong><br/>
                  <a href="${clinic.website}" target="_blank" style="color: #2563eb; text-decoration: none;">
                    Visit Website
                  </a>
                </div>
              </div>
            ` : ''}
            
            ${clinic.email ? `
              <div style="margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="font-size: 16px;">✉️</span>
                <div>
                  <strong>Email:</strong><br/>
                  <a href="mailto:${clinic.email}" style="color: #2563eb; text-decoration: none;">
                    ${clinic.email}
                  </a>
                </div>
              </div>
            ` : ''}
            
            ${clinic.openingHours ? `
              <div style="margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="font-size: 16px;">🕐</span>
                <div>
                  <strong>Hours:</strong><br/>
                  <span style="color: #6b7280;">${clinic.openingHours}</span>
                </div>
              </div>
            ` : ''}
            
            ${clinic.emergency ? `
              <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🚨</span>
                <div>
                  <strong>Emergency Services:</strong> 
                  <span style="color: ${clinic.emergency === 'Yes' ? '#059669' : '#dc2626'}; font-weight: 600;">
                    ${clinic.emergency}
                  </span>
                </div>
              </div>
            ` : ''}
            
            ${clinic.wheelchair ? `
              <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">♿</span>
                <div>
                  <strong>Wheelchair Access:</strong> 
                  <span style="color: #6b7280; text-transform: capitalize;">
                    ${clinic.wheelchair}
                  </span>
                </div>
              </div>
            ` : ''}
            
            ${clinic.beds ? `
              <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🛏️</span>
                <div>
                  <strong>Beds:</strong> 
                  <span style="color: #6b7280;">${clinic.beds}</span>
                </div>
              </div>
            ` : ''}
            
            ${clinic.speciality ? `
              <div style="margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
                <span style="font-size: 16px;">⚕️</span>
                <div>
                  <strong>Speciality:</strong><br/>
                  <span style="color: #6b7280; text-transform: capitalize;">
                    ${clinic.speciality.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ` : ''}
          </div>
          
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lon}" 
              target="_blank"
              style="display: inline-block; background: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; text-align: center; width: 100%; box-sizing: border-box;"
            >
              📍 Get Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      markersRef.current.push(marker);
    });
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim() || !leafletMapRef.current) return;

    setSearching(true);
    setError(null);

    try {
      // Use Nominatim API to geocode the search location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Failed to search location');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('Location not found. Please try a different search.');
        setSearching(false);
        return;
      }

      const { lat, lon } = data[0];
      const newLat = parseFloat(lat);
      const newLon = parseFloat(lon);

      console.log('🔍 Searched location:', { newLat, newLon, name: data[0].display_name });

      // Update map view
      leafletMapRef.current.setView([newLat, newLon], 13);

      // Fetch clinics for new location
      await fetchClinics(newLat, newLon);
    } catch (err) {
      console.error('Error searching location:', err);
      setError('Failed to search location. Please try again.');
    } finally {
      setSearching(false);
    }
  }

  function refreshCurrentLocation() {
    if (!navigator.geolocation || !leafletMapRef.current) return;

    setRefreshingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('🔄 Refreshed location:', { latitude, longitude });
        console.log('🎯 Accuracy:', position.coords.accuracy, 'meters');
        
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([latitude, longitude], 13);
        }
        
        fetchClinics(latitude, longitude);
        setRefreshingLocation(false);
      },
      (err) => {
        console.error('❌ Error refreshing location:', err.message);
        setError('Unable to refresh your location. Please try searching manually.');
        setRefreshingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar - Outside Map */}
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location (e.g., Asansol, Kolkata, Mumbai)"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={searching || !search.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={refreshCurrentLocation}
            disabled={refreshingLocation}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
            title="Refresh my location"
          >
            {refreshingLocation ? '🔄' : '📍'} {refreshingLocation ? 'Locating...' : 'My Location'}
          </button>
        </form>
      </div>

      {/* Loading/Error Messages */}
      {(loading || error) && (
        <div className="mb-4">
          {loading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-sm">
              Loading nearby clinics...
            </div>
          )}
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-[520px] rounded-md overflow-hidden relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Results Counter */}
        {!loading && clinics.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-[1000] text-sm font-medium">
            Found {clinics.length} clinic{clinics.length !== 1 ? 's' : ''} nearby
          </div>
        )}
      </div>
    </div>
  );
}