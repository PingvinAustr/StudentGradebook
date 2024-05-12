using System;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Threading;
using System.Threading.Tasks;

public class MemoryHealthCheck : IHealthCheck
{
    private readonly long _maxMemory;

    public MemoryHealthCheck()
    {
        _maxMemory = 1_000_000_000;
    }

    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var allocated = GC.GetTotalMemory(forceFullCollection: false);
        var data = new Dictionary<string, object>
        {
            { "AllocatedBytes", allocated },
            { "MaxBytes", _maxMemory }
        };

        var status = allocated < _maxMemory ? HealthStatus.Healthy : HealthStatus.Unhealthy;

        return Task.FromResult(new HealthCheckResult(
            status,
            description: "Reports degraded status if allocated bytes >= " + _maxMemory + " bytes",
            data: data));
    }
}
