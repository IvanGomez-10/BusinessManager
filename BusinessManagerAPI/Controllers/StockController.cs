using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using BusinessManagerAPI.Modelos;
using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore.V1;

namespace BusinessManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly FirestoreDb _firestoreDb;

        public StockController()
        {
            var credentialPath = Path.Combine(AppContext.BaseDirectory, "Config", "firebase-adminsdk.json");
            var credential = GoogleCredential.FromFile(credentialPath);
            var builder = new FirestoreClientBuilder { Credential = credential };
            _firestoreDb = FirestoreDb.Create("businessmanager-cf980", builder.Build());
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddProduct([FromBody] Product newProduct)
        {
            try
            {
                // Mensaje en consola para verificar que hemos llegado al método
                Console.WriteLine("Llegamos al método AddProduct");

                // Mostrar los datos de newProduct
                Console.WriteLine($"Datos del nuevo producto: {newProduct.Name}, {newProduct.Warehouse}, {newProduct.Price}, {newProduct.Discount}, {newProduct.Units}");

                // Comprobación de los datos del producto
                if (newProduct == null)
                {
                    return BadRequest(new { success = false, message = "Producto no válido." });
                }

                // Validación de los campos del producto
                if (string.IsNullOrEmpty(newProduct.Name) || string.IsNullOrEmpty(newProduct.Warehouse) ||
                    newProduct.Price <= 0 || newProduct.Discount < 0 || newProduct.Units < 0)
                {
                    return BadRequest(new { success = false, message = "Datos del producto incompletos o inválidos." });
                }

                // Crear el documento en Firestore
                DocumentReference docRef = _firestoreDb.Collection("productos").Document();
                newProduct.Id = docRef.Id;  // Asignamos el ID generado por Firestore

                var productData = new Dictionary<string, object>
                {
                    { "name", newProduct.Name },
                    { "warehouse", newProduct.Warehouse },
                    { "price", newProduct.Price },
                    { "discount", newProduct.Discount },
                    { "units", newProduct.Units }
                };

                // Insertar el producto en Firestore
                await docRef.SetAsync(productData);

                // Retornar la respuesta con el nuevo producto, incluido el ID generado
                return Ok(new { success = true, product = newProduct });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al añadir el producto.", error = ex.Message });
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                CollectionReference productsRef = _firestoreDb.Collection("productos");
                var snapshot = await productsRef.GetSnapshotAsync();
                var products = new List<Product>();

                foreach (var document in snapshot.Documents)
                {
                    var product = document.ConvertTo<Product>();
                    product.Id = document.Id;
                    products.Add(product);
                }

                return Ok(new { success = true, products });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al obtener los productos.", error = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProductStock(string id, [FromBody] Product updatedProduct)
        {
            try
            {
                // Buscar el producto en Firestore usando el ID
                DocumentReference docRef = _firestoreDb.Collection("productos").Document(id);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return NotFound(new { success = false, message = "Producto no encontrado." });
                }

                // Preparamos los datos para la actualización
                var updateData = new Dictionary<string, object>
                {
                    { "price", updatedProduct.Price },
                    { "discount", updatedProduct.Discount },
                    { "units", updatedProduct.Units }
                };

                // Actualizamos el producto en Firestore
                await docRef.UpdateAsync(updateData);
                return Ok(new { success = true, message = "Producto actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al actualizar el producto.", error = ex.Message });
            }
        }
        
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            try
            {
                DocumentReference docRef = _firestoreDb.Collection("productos").Document(id);
                await docRef.DeleteAsync();
                return Ok(new { success = true, message = "Producto eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al eliminar el producto.", error = ex.Message });
            }
        }
    }


    public class StockUpdateRequest
    {
        public int StockChange { get; set; }
    }
}
