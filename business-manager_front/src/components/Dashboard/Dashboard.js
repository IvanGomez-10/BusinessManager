import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';  // Importar los estilos CSS

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]); // Inicializar salesData como un array vacío
  const [totalSales, setTotalSales] = useState(0); // Dinero total vendido
  const [lowStockProducts, setLowStockProducts] = useState([]);
  
  const goToStock = () => {
    navigate('/inventario');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products data
        const productsResponse = await fetch('http://localhost:5267/api/Stock');
        const productsData = await productsResponse.json();
        setProducts(productsData.products);

        // Fetch sales data from Firestore
        const salesResponse = await fetch('http://localhost:5267/api/Ventas');
        const salesData = await salesResponse.json();
        
        // Log the full sales data received from Firebase
        console.log("Sales Data from Firebase:", salesData.sales);

        setSalesData(salesData.sales || []); // Asegurarse de que salesData sea un array

        // Calculate total money sold
        const totalSales = salesData.sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
        setTotalSales(totalSales);

        // Filter products with low stock
        const lowStock = productsData.products.filter(product => product.units && product.units < 10);
        setLowStockProducts(lowStock);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Agrupar ventas por producto
  const salesGroupedByProduct = salesData.reduce((acc, sale) => {
    sale.saleData.forEach(item => {
      const productId = item.productId;
      const productTotal = item.total;

      if (!acc[productId]) {
        acc[productId] = { name: item.name, totalSales: 0 };
      }

      acc[productId].totalSales += productTotal;
    });

    return acc;
  }, {});

  console.log("Sales Grouped by Product:", salesGroupedByProduct); // Log sales grouped by product

  // Crear datos para el gráfico
  const chartData = {
    labels: Object.values(salesGroupedByProduct).map(item => item.name), // Nombres de los productos
    datasets: [
      {
        label: 'Ventas por Producto',
        data: Object.values(salesGroupedByProduct).map(item => item.totalSales), // Totales de ventas por producto
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total de Productos</Card.Title>
              <Card.Text>{products.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Productos en Bajo Stock</Card.Title>
              <Card.Text>{lowStockProducts.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Ventas Totales</Card.Title>
              <Card.Text>{totalSales.toFixed(2)} $</Card.Text> {/* Dinero total vendido */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Gráfico de Ventas por Producto</Card.Title>
              <Bar data={chartData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Productos con Bajo Stock</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Unidades</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.units}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="warning" onClick={goToStock}>
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
