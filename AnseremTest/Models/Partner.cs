namespace AnseremTest.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Partner")]
    [JsonObject(IsReference = false)]
    public partial class Partner
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Partner()
        {
            Sale = new HashSet<Sale>();
        }

        public int PartnerID { get; set; }

        [Required]
        [StringLength(25)]
        public string PartnerName { get; set; }

        public int? ContactID { get; set; }

        public int? CityID { get; set; }

        public virtual City City { get; set; }

        public virtual Contact Contact { get; set; }

        [JsonIgnore]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Sale> Sale { get; set; }
    }
}
