import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserVideos, uploadVideo } from '../api-client';
import UploadVideoModal from '../components/UploadVideoModal';

interface Directory {
  id: number;
  name: string;
  subdirectories?: Directory[];
}

interface Video {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
  uploadedBy: {
    _id: string;
    username: string;
  };
  __v: number;
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const fetchVideos = async () => {
    try {
      const data = await getUserVideos();
      setVideos(data.map((video: any) => ({
        id: video._id,
        name: video.name,
        description: video.description,
        tags: video.tags,
        url: video.url,
        uploadedBy: video.uploadedBy,
        __v: video.__v,
      })));
    } catch (error) {
      console.error('Failed to fetch videos', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDirectoryClick = (dirId: number) => {
    navigate(`/main/${dirId}`);
  };

  const handleVideoClick = (id: string) => {
    navigate(`/video?videoId=${id}`);
  };

  const handleUpload = async () => {
    if (videoFile && name && description) {
      try {
        await uploadVideo(videoFile, name, description, tags);
        setShowModal(false);
        fetchVideos();
      } catch (error) {
        console.error('Failed to upload video', error);
      }
    } else {
      alert('Name and description are required');
    }
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
          <Button variant="primary" onClick={() => setShowModal(true)}>Add New Video</Button>
          <Row>
            {videos.length === 0 ? (
              <Col>
                <p>No videos available</p>
              </Col>
            ) : (
              videos.map(video => (
                <Col key={video.id} md={4} lg={3} className="mb-4">
                  <Card onClick={() => handleVideoClick(video.id)}>
                    <Card.Img variant="top" src={video.url} />
                    <Card.Body>
                      <Card.Title>{video.name}</Card.Title>
                      <Card.Text>{video.description}</Card.Text>
                      <Card.Text>{video.tags.join(', ')}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>

      <UploadVideoModal
        showModal={showModal}
        setShowModal={setShowModal}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        tags={tags}
        setTags={setTags}
        handleUpload={handleUpload}
      />
    </Container>
  );
};

export default Main;
