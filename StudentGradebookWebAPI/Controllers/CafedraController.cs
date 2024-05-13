using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentGradebookWebAPI.Database;

namespace StudentGradebookWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CafedraController : ControllerBase
    {
        private readonly StudentGradebookContext _context;

        public CafedraController(StudentGradebookContext context)
        {
            _context = context;
        }

        // GET: api/Cafedra
        [Auth]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cafedra>>> GetCafedras()
        {
            return await _context.Cafedras.ToListAsync();
        }

        // GET: api/Cafedra/5
        [Auth]
        [HttpGet("{id}")]
        public async Task<ActionResult<Cafedra>> GetCafedra(int id)
        {
            var cafedra = await _context.Cafedras.FindAsync(id);

            if (cafedra == null)
            {
                return NotFound();
            }

            return cafedra;
        }

        // POST: api/Cafedra
        [Auth]
        [HttpPost]
        public async Task<ActionResult<Cafedra>> PostCafedra(Cafedra cafedra)
        {
            _context.Cafedras.Add(cafedra);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCafedra", new { id = cafedra.EntryId }, cafedra);
        }

        // PUT: api/Cafedra/5
        [Auth]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCafedra(int id, Cafedra cafedra)
        {
            if (id != cafedra.EntryId)
            {
                return BadRequest();
            }

            _context.Entry(cafedra).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CafedraExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Cafedra/5
        [Auth]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCafedra(int id)
        {
            var cafedra = await _context.Cafedras.FindAsync(id);
            if (cafedra == null)
            {
                return NotFound();
            }

            _context.Cafedras.Remove(cafedra);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CafedraExists(int id)
        {
            return _context.Cafedras.Any(e => e.EntryId == id);
        }
    }
}
