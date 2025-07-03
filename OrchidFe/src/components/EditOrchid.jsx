import React, { useEffect, useState } from 'react';
import { Container, Button, Form, Image, Row, Col, Spinner, Alert } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import AdminService from '../services/adminService';
import '../styles/EditOrchid.css';

export default function EditOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orchid, setOrchid] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

  useEffect(() => {
    fetchOrchid();
  }, [id]);

  const fetchOrchid = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminService.getOrchidById(id);
      console.log('Fetched orchid data:', response.data); // Debug log
      setOrchid(response.data);

      // Map the correct field names from backend
      setValue('orchidName', response.data.orchidName || '');
      setValue('image', response.data.orchidUrl || response.data.image || ''); // Try both field names
      setValue('description', response.data.orchidDescription || response.data.description || '');
      setValue('price', response.data.price || 0);
      setValue('isNatural', response.data.isNatural || false);
    } catch (error) {
      console.error('Error fetching orchid:', error);
      setError('Failed to load orchid data. Please try again later.');
      toast.error('Error loading orchid data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Map form fields to backend field names
      const orchidData = {
        orchidName: data.orchidName,
        orchidUrl: data.image, // Map 'image' field to 'orchidUrl'
        orchidDescription: data.description, // Map 'description' to 'orchidDescription'
        price: parseFloat(data.price),
        isNatural: data.isNatural || false,
        categoryId: orchid.categoryId || orchid.category?.categoryId // Preserve category if exists
      };

      console.log('Sending orchid data:', orchidData); // Debug log

      await AdminService.updateOrchid(id, orchidData);
      toast.success('Orchid updated successfully!');
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update orchid.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="edit-orchid-container text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading orchid data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="edit-orchid-container">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => navigate('/admin')} className="floral-button">
            Return to Admin Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  return (
      <Container className="edit-orchid-container">
        <Toaster />
        <Row>
          <h2 className="floral-title mb-4">Edit Orchid: {orchid.orchidName}</h2>
          <hr />
          <Col md={6}>
            <Form onSubmit={handleSubmit(onSubmit)} className="floral-form">
              <Form.Group className="mb-3" controlId="orchidName">
                <Form.Label>Orchid Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter orchid name"
                  {...register('orchidName', { required: 'Name is required' })}
                  className="floral-input"
                  disabled={submitting}
                />
                {errors.orchidName && <p className="text-danger">{errors.orchidName.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  {...register('image', {
                    required: 'Image URL is required',
                    pattern: {
                      value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                      message: 'Must be a valid URL'
                    }
                  })}
                  className="floral-input"
                  disabled={submitting}
                />
                {errors.image && <p className="text-danger">{errors.image.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  {...register('description')}
                  className="floral-input"
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  {...register('price', {
                    valueAsNumber: true,
                    validate: value => value > 0 || 'Price must be greater than 0'
                  })}
                  className="floral-input"
                  disabled={submitting}
                />
                {errors.price && <p className="text-danger">{errors.price.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="isNatural">
                <Form.Check
                  type="switch"
                  label="Natural Orchid"
                  {...register('isNatural')}
                  disabled={submitting}
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="floral-button-secondary"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="floral-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={6} className="preview-container">
            <h3>Preview</h3>
            <div className="orchid-preview">
              <Image
                src={orchid.orchidUrl || orchid.image}
                alt={orchid.orchidName}
                className="preview-image shadow"
                fluid
              />
              <div className="preview-details">
                <h4>{orchid.orchidName}</h4>
                <p>{orchid.orchidDescription || orchid.description}</p>
                <span className={`badge ${orchid.isNatural ? 'floral-badge-natural' : 'floral-badge-industrial'}`}>
                  {orchid.isNatural ? 'Natural' : 'Industrial'}
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
}