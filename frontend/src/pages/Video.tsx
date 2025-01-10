import React from 'react';
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const Video: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const videoId = queryParams.get('videoId');

  return (
    <Container>
      <h2>Video Page</h2>
      <p>Displaying video with ID: {videoId}</p>
      {/* Add video player component here */}
    </Container>
  );
};

export default Video;
