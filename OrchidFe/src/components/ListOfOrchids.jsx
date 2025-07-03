import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Form, Image, Modal, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AdminService from '../services/adminService';
import '../styles/ListOfOrchids.css';

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchOrchids();
    fetchCategories();
  }, []);

  const fetchOrchids = async () => {
    try {
      setTableLoading(true);
      const response = await AdminService.getAllOrchids();
      const sortedData = response.data.sort((a, b) => parseInt(b.id || b.orchidId) - parseInt(a.id || a.orchidId));
      setOrchids(sortedData);
    } catch (error) {
      console.error('Error fetching orchids:', error);
      toast.error('Failed to fetch orchids.');
    } finally {
      setTableLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await AdminService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this orchid?')) {
      try {
        await AdminService.deleteOrchid(id);
        toast.success('Orchid deleted successfully!');
        fetchOrchids();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete orchid.');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Ensure isNatural is a boolean and rename image field to orchidUrl
      const formData = {
        ...data,
        isNatural: !!data.isNatural,
        price: parseFloat(data.price),
        categoryId: parseInt(data.categoryId),
        orchidUrl: data.image // Map the image field to orchidUrl for backend consistency
      };

      await AdminService.createOrchid(formData);
      setShow(false);
      fetchOrchids();
      reset();
      toast.success('Orchid added successfully!');
    } catch (error) {
      console.error('Add error:', error);
      toast.error('Failed to add orchid.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container className="orchid-list-container">
        <Toaster />
        <h2 className="floral-title mb-4">Our Orchid Collection</h2>
        {tableLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading orchids...</p>
          </div>
        ) : (
          <Table striped bordered hover className="floral-table">
            <thead>
            <tr>
              <th>Image</th>
              <th>Orchid Name</th>
              <th>Price</th>
              <th>Origin</th>
              <th>
                <Button onClick={handleShow} className="floral-button">
                  <i className="bi bi-plus-circle"></i> Add New Orchid
                </Button>
              </th>
            </tr>
            </thead>
            <tbody>
            {orchids.map((orchid) => (
                <tr key={orchid.orchidId || orchid.id}>
                  <td>
                    <Image src={orchid.orchidUrl || orchid.image} width={50} rounded className="floral-image" />
                  </td>
                  <td>{orchid.orchidName}</td>
                  <td className="text-success fw-bold">${orchid.price?.toFixed(2) || '0.00'}</td>
                  <td>
                    {orchid.isNatural ? (
                        <span className="badge floral-badge-natural">Natural</span>
                    ) : (
                        <span className="badge floral-badge-industrial">Industrial</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/edit/${orchid.orchidId || orchid.id}`} className="floral-link">
                    <span className="badge floral-badge-edit">
                      <i className="bi bi-pencil-square"></i> Edit
                    </span>
                    </Link>
                    <span
                        className="badge floral-badge-delete"
                        onClick={() => handleDelete(orchid.orchidId || orchid.id)}
                    >
                    <i className="bi bi-trash3"></i> Delete
                  </span>
                  </td>
                </tr>
            ))}
            {orchids.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No orchids found</td>
              </tr>
            )}
            </tbody>
          </Table>
        )}
        <Modal show={show} onHide={handleClose} backdrop="static" className="floral-modal">
          <Modal.Header closeButton>
            <Modal.Title>Add New Orchid</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formOrchidName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter orchid name"
                    {...register('orchidName', { required: 'Name is required' })}
                    className="floral-input"
                    disabled={loading}
                />
                {errors.orchidName && <p className="text-warning">{errors.orchidName.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formOrchidDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter orchid description"
                    {...register('orchidDescription', { required: 'Description is required' })}
                    className="floral-input"
                    disabled={loading}
                />
                {errors.orchidDescription && <p className="text-warning">{errors.orchidDescription.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formImage">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter image URL"
                    {...register('image', {
                      required: 'Image URL is required',
                      pattern: {
                        value: /(https?:\/\/[^\s]+)/i,
                        message: 'Must be a valid URL'
                      }
                    })}
                    className="floral-input"
                    disabled={loading}
                />
                {errors.image && <p className="text-warning">{errors.image.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPrice">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    {...register('price', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    className="floral-input"
                    disabled={loading}
                />
                {errors.price && <p className="text-warning">{errors.price.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  {...register('categoryId', { required: 'Category is required' })}
                  className="floral-input"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </Form.Select>
                {errors.categoryId && <p className="text-warning">{errors.categoryId.message}</p>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Natural"
                    {...register('isNatural')}
                    disabled={loading}
                />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} className="floral-button-secondary" disabled={loading}>
                  Close
                </Button>
                <Button variant="primary" type="submit" className="floral-button" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : (
                    'Save Orchid'
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
  );
}