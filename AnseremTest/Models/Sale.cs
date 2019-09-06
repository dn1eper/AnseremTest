namespace AnseremTest.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Sale")]
    public partial class Sale
    {
        public int SaleID { get; set; }

        [Required]
        [StringLength(25)]
        public string SaleName { get; set; }

        public int? PartnerID { get; set; }

        public int? ContactID { get; set; }

        public virtual Contact Contact { get; set; }

        public virtual Partner Partner { get; set; }
    }
}
