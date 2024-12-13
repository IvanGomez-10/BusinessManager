import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form, InputGroup, FormControl, Pagination, Modal } from 'react-bootstrap';
import './StockManager.css';

const StockManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editedProduct, setEditedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    warehouse: 'Madrid',
    price: '',
    discount: '',
    units: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [sortOrder, setSortOrder] = useState({ field: 'name', direction: 'asc' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // Guardamos el producto a eliminar

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5267/api/Stock');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (product) => {
    setEditedProduct({ ...product });
  };

  const handleSave = async (product) => {
    try {
      const response = await fetch(`http://localhost:5267/api/Stock/update/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: product.price,
          discount: product.discount,
          units: product.units,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProducts(products.map((p) => (p.id === product.id ? product : p)));
        setEditedProduct(null); // Cerrar la edición
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setEditedProduct(null); // Cancelar la edición
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://localhost:5267/api/Stock/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      if (data.success) {
        setProducts([...products, data.product]); // Añadir el nuevo producto a la lista
        setNewProduct({ name: '', warehouse: 'Madrid', price: '', discount: '', units: 0 });
        setShowAddModal(false); // Cerrar el modal de añadir
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5267/api/Stock/delete/${productToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter((product) => product.id !== productToDelete.id)); // Eliminar el producto de la lista
        setShowDeleteModal(false); // Cerrar el modal
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Cerrar el modal sin eliminar
    setProductToDelete(null);
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to calculate the final price considering the discount
  const calculateFinalPrice = (price, discount) => {
    if (discount > 0) {
      return (price - (price * (discount / 100))).toFixed(2); // Apply discount
    }
    return price.toFixed(2); // No discount, return original price
  };

  // Function to handle sorting
  const handleSort = (field) => {
    const direction = sortOrder.field === field && sortOrder.direction === 'asc' ? 'desc' : 'asc';
    setSortOrder({ field, direction });

    setProducts((prevProducts) =>
      [...prevProducts].sort((a, b) => {
        if (field === 'priceFinal') {
          const priceA = calculateFinalPrice(a.price, a.discount);
          const priceB = calculateFinalPrice(b.price, b.discount);
          return direction === 'asc' ? priceA - priceB : priceB - priceA;
        } else if (field === 'units') {
          return direction === 'asc' ? a.units - b.units : b.units - a.units;
        } else {
          return direction === 'asc' ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
        }
      })
    );
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col className="text-center">
          <h2>STOCK</h2>
        </Col>
        <Col>
          <InputGroup>
            <FormControl
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col>
          <Button variant="success" onClick={() => setShowAddModal(true)}>Añadir</Button>
        </Col>
      </Row>

      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Nombre</th>
              <th onClick={() => handleSort('warehouse')}>Almacén</th>
              <th onClick={() => handleSort('priceFinal')}>Precio</th>
              <th onClick={() => handleSort('discount')}>Descuento</th>
              <th onClick={() => handleSort('units')}>Unidades</th>
              <th>Precio Final</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.warehouse}</td>
                <td>
                  {editedProduct && editedProduct.id === product.id ? (
                    <Form.Control
                      type="number"
                      size="sm"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td>
                  {editedProduct && editedProduct.id === product.id ? (
                    <Form.Control
                      type="number"
                      size="sm"
                      value={editedProduct.discount}
                      onChange={(e) => setEditedProduct({ ...editedProduct, discount: e.target.value })}
                    />
                  ) : (
                    product.discount
                  )}
                </td>
                <td>
                  {editedProduct && editedProduct.id === product.id ? (
                    <Form.Control
                      type="number"
                      size="sm"
                      value={editedProduct.units}
                      onChange={(e) => setEditedProduct({ ...editedProduct, units: e.target.value })}
                    />
                  ) : (
                    product.units
                  )}
                </td>
                <td>{calculateFinalPrice(product.price, product.discount)}</td>
                <td>
                  {editedProduct && editedProduct.id === product.id ? (
                    <>
                      <Button variant="success" onClick={() => handleSave(editedProduct)}>
                        Guardar
                      </Button>
                      <Button variant="secondary" onClick={handleCancel} className="ml-2">
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="warning" onClick={() => handleEdit(product)}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => { setShowDeleteModal(true); setProductToDelete(product); }} className="ml-2">
                        Eliminar
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>

      {/* Paginación */}
      <Row>
        <Col className="text-center">
          <Pagination>
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </Col>
      </Row>

      {/* Modal de Confirmación para Eliminar */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Añadir Producto */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Almacén</Form.Label>
              <Form.Control
                as="select"
                value={newProduct.warehouse}
                onChange={(e) => setNewProduct({ ...newProduct, warehouse: e.target.value })}
                required
              >
                <option value="Madrid">Madrid</option>
                <option value="Barcelona">Barcelona</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descuento</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.discount}
                onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Unidades</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.units}
                onChange={(e) => setNewProduct({ ...newProduct, units: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Añadir Producto
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StockManager;
