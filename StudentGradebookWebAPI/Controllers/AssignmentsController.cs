using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using StudentGradebookWebAPI.Database;

namespace StudentGradebookWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentsController : ControllerBase
    {
        private readonly IMemoryCache _memoryCache;
        private readonly StudentGradebookContext _context;

        public AssignmentsController(StudentGradebookContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _memoryCache = memoryCache;
        }

        // GET: api/Assignments/ForStudent/5
        [Auth]
        [HttpGet("ForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignmentsForStudent(int studentId, [FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo, [FromQuery] int[] disciplineIds)
        {
            var query = _context.Assignments.Where(a => a.StudentId == studentId);

            if (dateFrom.HasValue)
                query = query.Where(a => a.GradeDate >= dateFrom);
            if (dateTo.HasValue)
                query = query.Where(a => a.GradeDate <= dateTo);
            if (disciplineIds != null && disciplineIds.Length > 0)
                query = query.Where(a => disciplineIds.Contains(a.DisciplineId));

            return await query.Include(a => a.Discipline).ToListAsync();
        }

        [Auth]
        [HttpGet("RecentGradesForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetRecentGradesForStudent(int studentId)
        {
            var query = _context.Assignments.Where(a => a.StudentId == studentId && a.GradeDate != null).OrderByDescending(x => x.GradeDate);

            return await query.Include(a => a.Discipline).ToListAsync();
        }

        [Auth]
        [HttpGet("DueDateThisWeekForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetDueDateThisWeekAssignmentsForStudent(int studentId)
        {
            var currentDate = DateTime.Today;
            var weekStart = currentDate.AddDays(-(int)currentDate.DayOfWeek + (int)DayOfWeek.Monday);
            var weekEnd = weekStart.AddDays(7);

            var assignmentsThisWeek = await _context.Assignments
                .Where(a => a.StudentId == studentId &&
                            a.DueDate >= weekStart &&
                            a.DueDate < weekEnd)
                .OrderBy(x => x.DueDate)
                .Include(a => a.Discipline)
                .ToListAsync();

            return assignmentsThisWeek;
        }

        // GET: api/Assignments/ForStudent/5
        [Auth]
        [HttpGet("AllForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAllAssignmentsForStudent(int studentId)
        {
            var query = _context.Assignments.Where(a => a.StudentId == studentId);

            return await query.Include(a => a.Discipline).ToListAsync();
        }

        [Auth]
        [HttpGet("NotCheckedForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetNotCheckedAssignmentsForStudent(int studentId)
        {
            var query = _context.Assignments.Where(a => a.StudentId == studentId && a.GradeDate == null);

            return await query.Include(a => a.Discipline).ToListAsync();
        }


        // GET: api/Assignments/ForTeacher/5
        [Auth]
        [HttpGet("ForTeacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignmentsForTeacher(int teacherId, [FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo, [FromQuery] int[] disciplineIds, [FromQuery] bool showOnlyUngraded)
        {
            var query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId);

            if (showOnlyUngraded)
            {
                query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId && a.GradeDate == null);
            }
            else
            {
                if (dateFrom.HasValue)
                    query = query.Where(a => a.GradeDate >= dateFrom);
                if (dateTo.HasValue)
                    query = query.Where(a => a.GradeDate <= dateTo);
            }

            if (disciplineIds != null && disciplineIds.Length > 0)
                query = query.Where(a => disciplineIds.Contains(a.DisciplineId));

            return await query.Include(a => a.Discipline).ToListAsync();
        }

        // GET: api/Assignments/ForTeacher/5
        [Auth]
        [HttpGet("AllForTeacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAllAssignmentsForTeacher(int teacherId)
        {
            var query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId);

            return await query.Include(a => a.Discipline).ToListAsync();
        }

        // GET: api/Assignments/UngradedForTeacher/5
        [Auth]
        [HttpGet("UngradedForTeacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetUngradedAssignmentsForTeacher(int teacherId)
        {
            var query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId && a.GradeDate == null).Take(20);

            return await query.Include(a => a.Discipline).Include(x => x.Student).Include(x => x.Student.Group).ToListAsync();
        }

        // GET: api/Assignments/RecentCheckedGradesByTeacher/5
        [Auth]
        [HttpGet("RecentCheckedGradesByTeacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetRecentCheckedGradesByTeacher(int teacherId)
        {
            var query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId && a.GradeDate != null).Take(20);

            return await query.Include(a => a.Discipline).Include(x => x.Student).Include(x => x.Student.Group).OrderByDescending(x => x.GradeDate).ToListAsync();
        }


        // GET: api/Assignments/by-disciplines
        [Auth]
        [HttpGet("by-disciplines")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignmentsByDisciplines(int studentId, [FromQuery] List<int> disciplineIds)
        {
            if (disciplineIds == null || !disciplineIds.Any())
            {
                return BadRequest("Discipline IDs are required");
            }

            var assignments = await _context.Assignments
                .Where(a => a.StudentId == studentId && disciplineIds.Contains(a.DisciplineId))
                .Include(a => a.Discipline)
                .ToListAsync();

            if (assignments == null || !assignments.Any())
            {
                return NotFound("No assignments found for the specified disciplines");
            }

            return assignments;
        }

        // GET: api/Assignments
        [Auth]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignments()
        {
            const string cacheKey = "AssignmentsList";
            if (!_memoryCache.TryGetValue(cacheKey, out List<Assignment> cachedData))
            {
                cachedData = await _context.Assignments.ToListAsync();
                var cacheExpiryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpiration = DateTime.Now.AddMinutes(5),
                    Priority = CacheItemPriority.High,
                    SlidingExpiration = TimeSpan.FromMinutes(2)
                };
                _memoryCache.Set(cacheKey, cachedData, cacheExpiryOptions);
            }
            return Ok(cachedData);
        }

        // GET: api/Assignments/5
        [Auth]
        [HttpGet("{id}")]
        public async Task<ActionResult<Assignment>> GetAssignment(int id)
        {
            var assignment = await _context.Assignments.FindAsync(id);

            if (assignment == null)
            {
                return NotFound();
            }

            return assignment;
        }

        // PUT: api/Assignments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Auth]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssignment(int id, Assignment assignment)
        {
            if (id != assignment.EntryId)
            {
                return BadRequest();
            }

            _context.Entry(assignment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssignmentExists(id))
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

        // POST: api/Assignments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Auth]
        [HttpPost]
        public async Task<ActionResult<Assignment>> PostAssignment(Assignment assignment)
        {
            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssignment", new { id = assignment.EntryId }, assignment);
        }

        // DELETE: api/Assignments/5
        [Auth]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null)
            {
                return NotFound();
            }

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AssignmentExists(int id)
        {
            return _context.Assignments.Any(e => e.EntryId == id);
        }
    }
}
