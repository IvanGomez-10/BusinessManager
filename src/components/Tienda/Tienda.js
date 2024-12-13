import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';

const Tienda = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantities, setQuantities] = useState({}); // Almacena las cantidades seleccionadas

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5267/api/Stock');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle adding/removing products from the cart
  const handleAddToCart = (product, quantity) => {
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find(item => item.product.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }

    setCart(updatedCart); // Actualizar el carrito
    updateTotalPrice(updatedCart); // Recalcular el precio total
  };

  // Update the total price whenever the cart changes
  const updateTotalPrice = (updatedCart) => {
    const price = updatedCart.reduce((acc, item) => {
      const finalPrice = item.product.discount > 0
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return acc + finalPrice * item.quantity;
    }, 0);
    setTotalPrice(price);
  };

  // Handle the checkout and save the sale
  const handleCheckout = async () => {
    const saleData = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      discount: item.product.discount,
      quantity: item.quantity,
      total: item.product.price * item.quantity,
    }));

    try {
      const response = await fetch('http://localhost:5267/api/Ventas/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saleData, totalPrice }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Venta realizada correctamente');
        setCart([]);  // Vaciar el carrito
        setTotalPrice(0);  // Restablecer el total
      } else {
        console.error('Error al realizar la venta:', data.message);
      }
    } catch (error) {
      console.error('Error al realizar la venta:', error);
    }
  };

  // Handle quantity change but not add to cart yet
  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  return (
    <Container>
      <h2 className="text-center my-4">Tienda</h2>
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  <strong>Precio:</strong> ${product.price} <br />
                  {product.discount > 0 && (
                    <span>
                      <strong>Descuento:</strong> {product.discount}%
                    </span>
                  )}
                </Card.Text>
                <Form.Group controlId={`quantity-${product.id}`}>
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={product.units}
                    value={quantities[product.id] || 1}  // Show selected quantity
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(product, quantities[product.id] || 1)} // Add to cart when clicked
                >
                  Añadir
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="my-4">Carrito</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Final</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>
                ${(item.product.discount > 0
                  ? item.product.price * (1 - item.product.discount / 100)
                  : item.product.price
                ) * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4>Total: ${totalPrice.toFixed(2)}</h4>

      <Button variant="success" onClick={handleCheckout}>Comprar</Button>
    </Container>
  );
};

export default Tienda;
