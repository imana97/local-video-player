import React from 'react';
import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Directory {
  id: number;
  name: string;
  subdirectories?: Directory[];
}

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  directoryId: number;
}

const Main: React.FC = () => {
  const navigate = useNavigate();
  const directories: Directory[] = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' },
    { id: 5, name: 'Sci-Fi' },
  ];
  const videos: Video[] = [
    { id: 1, title: 'Video 1', thumbnail: 'path/to/thumbnail1.jpg', directoryId: 1 },
    { id: 2, title: 'Video 2', thumbnail: 'path/to/thumbnail2.jpg', directoryId: 2 },
    { id: 3, title: 'Video 3', thumbnail: 'path/to/thumbnail3.jpg', directoryId: 3 },
    // ...more videos
  ];

  const handleDirectoryClick = (dirId: number) => {
    navigate(`/main/${dirId}`);
  };

  const handleVideoClick = (id: number) => {
    navigate(`/video?videoId=${id}`);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <h4>Directories</h4>
          <ListGroup>
            {directories.map((dir) => (
              <ListGroup.Item key={dir.id} action onClick={() => handleDirectoryClick(dir.id)}>
                {dir.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9}>
          <h4>Videos</h4>
          <Row>
            {videos.map(video => (
              <Col key={video.id} md={4} lg={3} className="mb-4">
                <Card onClick={() => handleVideoClick(video.id)}>
                  <Card.Img variant="top" src={video.thumbnail} />
                  <Card.Body>
                    <Card.Title>{video.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Main;
