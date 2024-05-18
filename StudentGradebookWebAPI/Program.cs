using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using StudentGradebookWebAPI.Database;
using StudentGradebookWebAPI.Services;
using System.Text;

namespace StudentGradebookWebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add CORS services
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            // Add services to the container.
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });

            // Register the DbContext
            builder.Services.AddDbContext<StudentGradebookContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("StudentGradebookConnection")));

            // Add authentication using JWT
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"]
                    };
                });

            // Add support to logging with Serilog
            builder.Host.UseSerilog((context, configuration) =>
                configuration.ReadFrom.Configuration(context.Configuration));

            // Memory Cache, SignalR, and Background Services
            builder.Services.AddMemoryCache();
            builder.Services.AddSignalR();
            builder.Services.AddHostedService<TickTackService>();
            builder.Services.AddHttpClient();
            builder.Services.AddHostedService<WeeklyRequestService>();

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddApplicationInsightsTelemetry(builder.Configuration["ApplicationInsights:InstrumentationKey"]);

            // Health Checks
            builder.Services.AddHealthChecks()
                .AddDbContextCheck<StudentGradebookContext>("StudentGradebook")
                .AddCheck<DiskStorageHealthCheck>("Disk Storage", failureStatus: HealthStatus.Degraded, tags: new[] { "storage" })
                .AddCheck<MemoryHealthCheck>("Memory", failureStatus: HealthStatus.Degraded, tags: new[] { "memory" })
                .AddCheck<CpuHealthCheck>("CPU Load", failureStatus: HealthStatus.Degraded, tags: new[] { "cpu" });
            var app = builder.Build();

            // Use logging
            app.UseSerilogRequestLogging();

            // Enable middleware for Swagger
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Standard middleware
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowAll");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            // Map endpoints
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<TickTackHub>("/tickTackHub");
                endpoints.MapHealthChecks("/health", new HealthCheckOptions
                {
                    Predicate = _ => true,
                    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
                });
            });

            app.Run();
        }
    }
}
