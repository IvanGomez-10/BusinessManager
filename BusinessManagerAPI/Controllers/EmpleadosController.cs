// Controllers/EmployeesController.cs
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using BusinessManagerAPI.Modelos;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore.V1;

[Route("api/[controller]")]
[ApiController]
public class EmpleadosController : ControllerBase
{
    private readonly FirestoreDb _firestoreDb;

    public EmpleadosController()
    {
        var credentialPath = Path.Combine(AppContext.BaseDirectory, "Config", "firebase-adminsdk.json");
        var credential = GoogleCredential.FromFile(credentialPath);
        var builder = new FirestoreClientBuilder { Credential = credential };
        
        // Crear FirestoreDb con las credenciales específicas
        _firestoreDb = FirestoreDb.Create("businessmanager-cf980", builder.Build());
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddEmployee([FromBody] Empleado empleado)
    {
    try
    {
        DocumentReference docRef = _firestoreDb.Collection("empleados").Document();

        // Asigna el ID generado por Firestore al campo Id del empleado
        empleado.Id = docRef.Id;

        // Convertir el objeto empleado a un diccionario, incluyendo el ID
        var empleadoData = new Dictionary<string, object>
        {
            { "id", empleado.Id },
            { "nombre", empleado.Nombre },
            { "edad", empleado.Edad },
            { "posicion", empleado.Posicion },
            { "habilidades", empleado.Habilidades },
            { "observaciones", empleado.Observaciones }
        };

        await docRef.SetAsync(empleadoData);
        return Ok(new { success = true, message = "Empleado añadido exitosamente.", empleado  });
    }
    catch (Exception ex)
    {
        return BadRequest(new { success = false, message = "Error al añadir el empleado.", error = ex.Message });
    }
    }

    [HttpGet]
    public async Task<IActionResult> GetEmpleados()
    {
        try
        {
            CollectionReference empleadosRef = _firestoreDb.Collection("empleados");
            QuerySnapshot snapshot = await empleadosRef.GetSnapshotAsync();

            var empleados = snapshot.Documents.Select(doc => doc.ConvertTo<Empleado>()).ToList();

            return Ok(new { success = true, empleados });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = "Error al obtener los empleados.", error = ex.Message });
        }
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteEmpleado(string id)
    {
        try
        {
            DocumentReference docRef = _firestoreDb.Collection("empleados").Document(id);
            await docRef.DeleteAsync();
            return Ok(new { success = true, message = "Empleado eliminado exitosamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = "Error al eliminar el empleado.", error = ex.Message });
        }
    }

    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateEmpleado(string id, [FromBody] Empleado updatedEmpleado)
    {
        try
        {
            DocumentReference docRef = _firestoreDb.Collection("empleados").Document(id);
            var snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return NotFound(new { success = false, message = "Empleado no encontrado." });
            }

            // Solo actualiza las observaciones (u otros campos necesarios)
            var updates = new Dictionary<string, object>
            {
                { "observaciones", updatedEmpleado.Observaciones }
            };

            await docRef.UpdateAsync(updates);
            return Ok(new { success = true, message = "Observaciones actualizadas correctamente." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = "Error al actualizar el empleado.", error = ex.Message });
        }
    }

}
