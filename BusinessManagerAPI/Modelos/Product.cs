using Google.Cloud.Firestore;

namespace BusinessManagerAPI.Modelos
{
    [FirestoreData]
    public class Product
    {
        [FirestoreProperty("id")]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty("name")]
        public string Name { get; set; } = string.Empty;

        [FirestoreProperty("warehouse")]
        public string Warehouse { get; set; } = string.Empty;

        [FirestoreProperty("price")]
        public double Price { get; set; }

        [FirestoreProperty("discount")]
        public double Discount { get; set; }

        [FirestoreProperty("units")]
        public int Units { get; set; }
    }
}
