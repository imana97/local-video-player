import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface UploadVideoModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  handleUpload: () => void;
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  showModal,
  setShowModal,
  videoFile,
  setVideoFile,
  name,
  setName,
  description,
  setDescription,
  tags,
  setTags,
  handleUpload,
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Upload New Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formVideoFile">
            <Form.Label>Video File</Form.Label>
            <Form.Control type="file" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control type="text" value={tags.join(', ')} onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        <Button variant="primary" onClick={handleUpload}>Upload</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadVideoModal;
