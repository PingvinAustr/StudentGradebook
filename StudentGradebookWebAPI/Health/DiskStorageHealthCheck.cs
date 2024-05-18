using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

public class DiskStorageHealthCheck : IHealthCheck
{
    private readonly long _minimumFreeBytes;

    public DiskStorageHealthCheck()
    {
        _minimumFreeBytes = 5000000000L;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var freeBytes = new DriveInfo(Path.GetPathRoot(Environment.SystemDirectory)).AvailableFreeSpace;
        if (freeBytes > _minimumFreeBytes)
        {
            return Task.FromResult(HealthCheckResult.Healthy($"Available disk space is sufficient ({freeBytes} bytes free)."));
        }
        else
        {
            return Task.FromResult(HealthCheckResult.Unhealthy($"Available disk space is insufficient ({freeBytes} bytes free, {_minimumFreeBytes} bytes required)."));
        }
    }
}
