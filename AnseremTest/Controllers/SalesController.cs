using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using AnseremTest.Models;

namespace AnseremTest.Controllers
{
    public class SalesController : ApiController
    {
        private SalesDataModel db = new SalesDataModel();

        // GET: api/Sales
        public IQueryable<Sale> GetSale()
        {
            return db.Sale;
        }

        // GET: api/Sales/5
        [ResponseType(typeof(Sale))]
        public IHttpActionResult GetSale(int id)
        {
            Sale sale = db.Sale.Find(id);
            if (sale == null)
            {
                return NotFound();
            }

            return Ok(sale);
        }

        // PUT: api/Sales/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSale(int id, Sale sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sale.SaleID)
            {
                return BadRequest();
            }

            if (sale.Contact != null)
            {
                db.Entry(sale.Contact).State = sale.Contact.ContactID == 0 ?
                    EntityState.Added :
                    EntityState.Modified;
            }
            else sale.ContactID = null;

            if (sale.Partner != null)
            {
                if (sale.Partner.Contact != null)
                {
                    db.Entry(sale.Partner.Contact).State = sale.Partner.Contact.ContactID == 0 ?
                        EntityState.Added :
                        EntityState.Modified;
                }
                else sale.Partner.ContactID = null;

                if (sale.Partner.City != null)
                {
                    db.Entry(sale.Partner.City).State = sale.Partner.City.CityID == 0 ?
                        EntityState.Added :
                        EntityState.Modified;
                }
                else sale.Partner.CityID = null;

                db.Entry(sale.Partner).State = sale.Partner.PartnerID == 0 ?
                    EntityState.Added :
                    EntityState.Modified;
            }
            else sale.PartnerID = null;

            db.Entry(sale).State = EntityState.Modified;
            
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Sales
        [ResponseType(typeof(Sale))]
        public IHttpActionResult PostSale(Sale sale)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Sale.Add(sale);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = sale.SaleID }, sale);
        }

        // DELETE: api/Sales/5
        [ResponseType(typeof(Sale))]
        public IHttpActionResult DeleteSale(int id)
        {
            Sale sale = db.Sale.Find(id);
            if (sale == null)
            {
                return NotFound();
            }

            db.Sale.Remove(sale);
            db.SaveChanges();

            return Ok(sale);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SaleExists(int id)
        {
            return db.Sale.Count(e => e.SaleID == id) > 0;
        }
    }
}