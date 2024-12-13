using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using BusinessManagerAPI.Modelos;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace BusinessManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly FirestoreDb _firestoreDb;

        public VentasController()
        {
            var credentialPath = Path.Combine(AppContext.BaseDirectory, "Config", "firebase-adminsdk.json");
            var credential = Google.Apis.Auth.OAuth2.GoogleCredential.FromFile(credentialPath);
            var builder = new Google.Cloud.Firestore.V1.FirestoreClientBuilder { Credential = credential };
            _firestoreDb = FirestoreDb.Create("businessmanager-cf980", builder.Build());
        }

        [HttpGet]
        public async Task<IActionResult> GetSales()
        {
            try
            {
                var salesRef = _firestoreDb.Collection("ventas");
                var snapshot = await salesRef.GetSnapshotAsync();
                var sales = new List<Sale>();

                foreach (var document in snapshot.Documents)
                {
                    var sale = document.ConvertTo<Sale>();
                    sale.Id = document.Id;
                    sales.Add(sale);
                }

                return Ok(new { success = true, sales });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al obtener las ventas.", error = ex.Message });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddSale([FromBody] SaleRequest saleRequest)
        {
            try
            {
                // Crear un nuevo documento de venta en Firestore
                var saleRef = _firestoreDb.Collection("ventas").Document();
                var saleData = new Sale
                {
                    Id = saleRef.Id,
                    Date = Timestamp.FromDateTime(DateTime.UtcNow),
                    TotalPrice = saleRequest.TotalPrice,
                    SaleData = saleRequest.SaleData
                };

                // Guardar la venta en la colección "ventas"
                await saleRef.SetAsync(saleData);
                return Ok(new { success = true, message = "Venta realizada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = "Error al realizar la venta.", error = ex.Message });
            }
        }
    }

    // El cuerpo de la solicitud (Request) para la venta
    public class SaleRequest
    {
        public double TotalPrice { get; set; }
        public List<SaleItem> SaleData { get; set; } = new List<SaleItem>();
    }
}
