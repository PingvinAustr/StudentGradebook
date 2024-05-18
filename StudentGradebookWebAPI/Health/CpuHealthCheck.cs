using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

public class CpuHealthCheck : IHealthCheck
{
    private readonly double _threshold;

    public CpuHealthCheck()
    {
        _threshold = 50;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");

        // First call always returns 0
        cpuCounter.NextValue();
        await Task.Delay(500); // Wait for half a second

        var value = cpuCounter.NextValue();
        var status = value < _threshold ? HealthStatus.Healthy : HealthStatus.Unhealthy;

        return new HealthCheckResult(
            status,
            description: $"CPU usage ({value}%) exceeds threshold of {_threshold}%",
            data: new Dictionary<string, object> { { "CPU Usage", value } });
    }
}
