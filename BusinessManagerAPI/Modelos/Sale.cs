using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;

namespace BusinessManagerAPI.Modelos
{
    [FirestoreData]
    public class Sale
    {
        [FirestoreProperty("id")]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty("date")]
        public Timestamp Date { get; set; }

        [FirestoreProperty("totalPrice")]
        public double TotalPrice { get; set; }

        [FirestoreProperty("saleData")]
        public List<SaleItem> SaleData { get; set; } = new List<SaleItem>();
    }

    [FirestoreData]
    public class SaleItem
    {
        [FirestoreProperty("productId")]
        public string ProductId { get; set; } = string.Empty;

        [FirestoreProperty("name")]
        public string Name { get; set; } = string.Empty;

        [FirestoreProperty("price")]
        public double Price { get; set; }

        [FirestoreProperty("discount")]
        public double Discount { get; set; }

        [FirestoreProperty("quantity")]
        public int Quantity { get; set; }

        [FirestoreProperty("total")]
        public double Total { get; set; }
    }
}
