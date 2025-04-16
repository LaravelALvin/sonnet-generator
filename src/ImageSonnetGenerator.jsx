import React, { useState } from 'react';
import './ImageSonnetGenerator.css';

const imageData = [
  {
    id: 1,
    imageSrc: '/images/basketball.png',
    jsonData: {
      objects: [
        {
          frame_id: 'frame_00123',
          timestamp: '00:15:23.450',
          objects: [
            {
              class: 'player',
              id: 1,
              bbox: [120, 220, 80, 180],
              confidence: 0.97,
              team_color: 'purple',
              pose: 'dribbling',
            },
            {
              class: 'player',
              id: 2,
              bbox: [300, 210, 85, 175],
              confidence: 0.94,
              team_color: 'green',
              pose: 'defending',
            },
            {
              class: 'ball',
              id: 99,
              bbox: [160, 280, 20, 20],
              confidence: 0.99,
              state: 'in_hand',
            },
            {
              class: 'basket',
              id: 200,
              bbox: [580, 120, 60, 40],
              confidence: 1.0,
            },
          ],
          court_zone: 'left-wing',
          action: 'drive_attempt',
        },
      ],
    },
  },
  {
    id: 2,
    imageSrc: '/images/tricycle.jpg',
    jsonData: {
      objects: [
        {
          frame_id: 'frame_04567',
          timestamp: '2025-04-14T08:34:12.123Z',
          location: {
            city: 'Butuan',
            street: 'J.C. Aquino Avenue',
            coordinates: {
              lat: 8.9495,
              lng: 125.5362,
            },
          },
          objects: [
            {
              class: 'tricycle',
              id: 101,
              bbox: [250, 300, 160, 120],
              confidence: 0.98,
              color: 'red-orange',
              occupants: 2,
              license_plate_visible: true,
            },
            {
              class: 'person',
              id: 102,
              bbox: [270, 320, 40, 100],
              confidence: 0.96,
              role: 'driver',
            },
            {
              class: 'person',
              id: 103,
              bbox: [310, 325, 38, 95],
              confidence: 0.94,
              role: 'passenger',
            },
            {
              class: 'traffic_light',
              id: 201,
              bbox: [600, 100, 30, 80],
              confidence: 0.99,
              state: 'green',
            },
          ],
          weather: 'partly cloudy',
          road_condition: 'dry',
          traffic_density: 'moderate',
        },
      ],
    },
  },
  {
    id: 3,
    imageSrc: '/images/runner.jpg',
    jsonData: {
      objects: [
        {
          frame_id: 'frame_07892',
          timestamp: '2025-04-14T09:45:33.789Z',
          location: {
            city: 'Butuan',
            street: 'National Highway',
            coordinates: {
              lat: 8.948,
              lng: 125.5365,
            },
          },
          objects: [
            {
              class: 'runner',
              id: 201,
              bbox: [150, 220, 80, 180],
              confidence: 0.95,
              gender: 'male',
              age: '25-30',
              clothing: 'sportswear',
              pose: 'running',
              action: 'marathon',
              distance_remaining: '35km',
            },
            {
              class: 'coconut_tree',
              id: 301,
              bbox: [450, 100, 50, 150],
              confidence: 0.99,
              type: 'coconut',
              height: 'tall',
            },
            {
              class: 'shadow',
              id: 402,
              bbox: [160, 400, 100, 30],
              confidence: 0.9,
              object: 'runner',
            },
          ],
          weather: 'sunny',
          time_of_day: 'morning',
          terrain: 'paved road',
          event: 'marathon',
        },
      ],
    },
  },
];

const ImageSonnetGenerator = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const [sonnets, setSonnets] = useState({});

  const handleGenerateSonnet = async (id, jsonData) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      // Preparing the message structure
      const message = `Compose a Shakespearean sonnet inspired by the following scene:\n\n${JSON.stringify(jsonData, null, 2)}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }), // Sending the message to the backend
      });

      const data = await res.json();
      const sonnet = data.reply || data.error || "No response from API."; // Handling the response
      setSonnets((prev) => ({ ...prev, [id]: sonnet }));
    } catch (err) {
      console.error('Fetch failed:', err);
      setSonnets((prev) => ({ ...prev, [id]: 'Something went wrong. Please try again.' }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="image-sonnet-generator">
      <h2>Image Sonnet Generator</h2>
      <div className="image-grid">
        {imageData.map(({ id, imageSrc, jsonData }) => (
          <div key={id} className="image-card">
            <img src={imageSrc} alt={`Scene ${id}`} className="uniform-image" />
            <button
              className="generate-button"
              onClick={() => handleGenerateSonnet(id, jsonData)}
              disabled={loadingStates[id]}
            >
              {loadingStates[id] ? (
                <span className="spinner" aria-label="Loading"></span>
              ) : (
                'Generate Sonnet'
              )}
            </button>
            {sonnets[id] && (
              <div className="sonnet-output">
                <h3>Generated Sonnet:</h3>
                <pre>{sonnets[id]}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSonnetGenerator;
