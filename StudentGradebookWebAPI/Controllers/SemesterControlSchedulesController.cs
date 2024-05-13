using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentGradebookWebAPI.Database;

namespace StudentGradebookWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SemesterControlSchedulesController : ControllerBase
    {
        private readonly StudentGradebookContext _context;

        public SemesterControlSchedulesController(StudentGradebookContext context)
        {
            _context = context;
        }

        // GET: api/SemesterControlSchedules
        [Auth]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SemesterControlSchedule>>> GetSemesterControlSchedules()
        {
            return await _context.SemesterControlSchedules.ToListAsync();
        }

        [Auth]
        [HttpGet("SemesterScheduleForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<SemesterControlSchedule>>> GetSemesterScheduleForStudent(int studentId)
        {
            var query = _context.SemesterControlSchedules.Where(x => x.Group.Students.Any(y => y.EntryId == studentId));

            return await query.Include(a => a.ControlType).ToListAsync();
        }

        // GET: api/SemesterControlSchedules/5
        [Auth]
        [HttpGet("{id}")]
        public async Task<ActionResult<SemesterControlSchedule>> GetSemesterControlSchedule(int id)
        {
            var semesterControlSchedule = await _context.SemesterControlSchedules.FindAsync(id);

            if (semesterControlSchedule == null)
            {
                return NotFound();
            }

            return semesterControlSchedule;
        }

        // PUT: api/SemesterControlSchedules/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Auth]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSemesterControlSchedule(int id, SemesterControlSchedule semesterControlSchedule)
        {
            if (id != semesterControlSchedule.EntryId)
            {
                return BadRequest();
            }

            _context.Entry(semesterControlSchedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SemesterControlScheduleExists(id))
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

        // POST: api/SemesterControlSchedules
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Auth]
        [HttpPost]
        public async Task<ActionResult<SemesterControlSchedule>> PostSemesterControlSchedule(SemesterControlSchedule semesterControlSchedule)
        {
            _context.SemesterControlSchedules.Add(semesterControlSchedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSemesterControlSchedule", new { id = semesterControlSchedule.EntryId }, semesterControlSchedule);
        }

        // DELETE: api/SemesterControlSchedules/5
        [Auth]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSemesterControlSchedule(int id)
        {
            var semesterControlSchedule = await _context.SemesterControlSchedules.FindAsync(id);
            if (semesterControlSchedule == null)
            {
                return NotFound();
            }

            _context.SemesterControlSchedules.Remove(semesterControlSchedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SemesterControlScheduleExists(int id)
        {
            return _context.SemesterControlSchedules.Any(e => e.EntryId == id);
        }
    }
}
