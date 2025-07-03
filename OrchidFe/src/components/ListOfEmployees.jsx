import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/esm/Container';
import { Button, Form, FormGroup, Image, Modal } from 'react-bootstrap'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";

export default function ListOfEmployees() {
    const baseUrl = import.meta.env.VITE_API_URL_EMPL
    const[api, setAPI] = useState([])
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { register, handleSubmit,formState: { errors }, control, reset } = useForm();
    const [value, setValue] = useState('');
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
          const response = await axios.get(baseUrl); 
          const sortedData = response.data.sort((a, b) => parseInt(b.empId) - parseInt(a.empId));
          setAPI(sortedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      const onSubmit = async (data) => {
        try {
          const response = await axios.post(baseUrl, data, { 
            headers: { 'Content-Type': 'application/json' }
          });
          setShow(false);
          fetchData();
          reset();
          setValue('');
          toast.success("Employee added successfully!");
        } catch (error) {
          console.log(error.message);
          toast.error("Employee added fail!");
        }
      };
  return (
    <Container>
    <Toaster/>
   <div className="p-3">
   <button onClick={handleShow} type='button' className="btn btn-primary">
    <i className="bi bi-node-plus"> Add new employee</i>
    </button>
   </div>

    <Table striped bordered hover my-5>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Designation</th>
        </tr>
      </thead>
      <tbody>
      {api.map((a)=>(
        <tr key={a.id}>
          <td><Image src={a.url} width='100%' thumbnail />
          </td>
          <td>{a.name}</td>
          <td>{a.gender ? 
            <span className='badge' style={{ backgroundColor:'#6ea8fe'}}> Male <i className="bi bi-gender-male"></i></span>: 
            <span className='badge' style={{ backgroundColor:'#efadce'}}> Female <i className="bi bi-gender-female"></i></span>}</td>
        <td>{a.designation}</td>
        </tr>
          ))}
      </tbody>
    </Table>
    <Modal show={show} onHide={handleClose} backdrop="static">
    <Modal.Header closeButton>
      <Modal.Title>New Employee</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            autoFocus
            {...register("name", { required: true })}
          />
          {errors.name && errors.name.type === "required" && <p className="text-warning">Name is required</p>}
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
        >
          <Form.Label>Image</Form.Label>
          <Form.Control 
            type="text" 
            {...register("url", { required: true, pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi })}
          />
          {errors.url && errors.url.type === "pattern" && <p className="text-warning">Image must be a valid URL</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Designation</Form.Label>
          <Form.Control
            type="text"
            as="textarea" rows={3} 
            {...register("designation", { required: true })}
          />
          {errors.designation && errors.designation.type === "required" && <p className="text-warning">Designation is required</p>}
        </Form.Group>
        <FormGroup>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Male"
            {...register("gender")}
          />
        </FormGroup>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal.Body>
</Modal>

    </Container>
  )
}
