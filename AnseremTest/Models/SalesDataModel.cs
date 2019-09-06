namespace AnseremTest.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class SalesDataModel : DbContext
    {
        public SalesDataModel()
            : base("name=SalesDataModel")
        {
        }

        public virtual DbSet<City> City { get; set; }
        public virtual DbSet<Contact> Contact { get; set; }
        public virtual DbSet<Partner> Partner { get; set; }
        public virtual DbSet<Sale> Sale { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<City>()
                .Property(e => e.CityName)
                .IsUnicode(false);

            modelBuilder.Entity<Contact>()
                .Property(e => e.FullName)
                .IsUnicode(false);

            modelBuilder.Entity<Contact>()
                .Property(e => e.Telephone)
                .IsUnicode(false);

            modelBuilder.Entity<Partner>()
                .Property(e => e.PartnerName)
                .IsUnicode(false);

            modelBuilder.Entity<Sale>()
                .Property(e => e.SaleName)
                .IsUnicode(false);
        }
    }
}
