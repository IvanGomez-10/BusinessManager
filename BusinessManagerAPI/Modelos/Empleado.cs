using Google.Cloud.Firestore;

namespace BusinessManagerAPI.Modelos
{
    [FirestoreData]
    public class Empleado
    {
        [FirestoreProperty("id")]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [FirestoreProperty("edad")]
        public int Edad { get; set; }

        [FirestoreProperty("posicion")]
        public string Posicion { get; set; } = string.Empty;

        [FirestoreProperty("habilidades")]
        public string Habilidades { get; set; } = string.Empty;

        [FirestoreProperty("observaciones")]
        public string Observaciones { get; set; } = string.Empty;
    }
}
