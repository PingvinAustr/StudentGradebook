﻿using System;
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
    public class AssignmentsController : ControllerBase
    {
        private readonly StudentGradebookContext _context;

        public AssignmentsController(StudentGradebookContext context)
        {
            _context = context;
        }

        // GET: api/Assignments/ForStudent/5
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

        // GET: api/Assignments/ForStudent/5
        [HttpGet("AllForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAllAssignmentsForStudent(int studentId)
        {
            var query = _context.Assignments.Where(a => a.StudentId == studentId);

            return await query.Include(a => a.Discipline).ToListAsync();
        }

        [HttpGet("NotCheckedForStudent/{studentId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetNotCheckedAssignmentsForStudent(int studentId)
        {
            var query = _context.Assignments.Where(a => a.StudentId == studentId && a.GradeDate == null);

            return await query.Include(a => a.Discipline).ToListAsync();
        }


        // GET: api/Assignments/ForTeacher/5
        [HttpGet("ForTeacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignmentsForTeacher(int teacherId, [FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo, [FromQuery] int[] disciplineIds, [FromQuery] bool showOnlyUngraded)
        {
            var query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId);

            if (showOnlyUngraded)
            {
                query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId && a.GradeDate == null);
            } else
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
        [HttpGet("AllForTeacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAllAssignmentsForTeacher(int teacherId)
        {
            var query = _context.Assignments.Where(a => a.Discipline.TeacherId == teacherId);

            return await query.Include(a => a.Discipline).ToListAsync();
        }


        // GET: api/Assignments/by-disciplines
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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignments()
        {
            return await _context.Assignments.ToListAsync();
        }

        // GET: api/Assignments/5
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
        [HttpPost]
        public async Task<ActionResult<Assignment>> PostAssignment(Assignment assignment)
        {
            _context.Assignments.Add(assignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssignment", new { id = assignment.EntryId }, assignment);
        }

        // DELETE: api/Assignments/5
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
