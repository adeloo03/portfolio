using System.Globalization;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Docker.DotNet;
using Docker.DotNet.Models;

namespace StatusPublisher;

public sealed class PublisherWorker(
    IHttpClientFactory httpClientFactory,
    ILogger<PublisherWorker> logger) : BackgroundService
{
    private static readonly TimeSpan PublishInterval = TimeSpan.FromMinutes(15);

    // Written by homelab/scripts/set-state.sh. Read on every publish, so a
    // restore test shows up on the site without restarting this container.
    private const string StatePath = "/state/status-state.json";

    // Nulls are written, not omitted: the contract is `string | null`.
    private static readonly JsonSerializerOptions JsonOptions = new();

    private readonly string _gistId  = RequireEnv("GITHUB_GIST_ID");
    private readonly string _token   = RequireEnv("GITHUB_TOKEN");

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Publish immediately on start, then every 15 minutes.
        await TryPublish(stoppingToken);

        using var timer = new PeriodicTimer(PublishInterval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await TryPublish(stoppingToken);
        }
    }

    private async Task TryPublish(CancellationToken ct)
    {
        try
        {
            var snapshot = await BuildSnapshot(ct);
            var json     = JsonSerializer.Serialize(snapshot, JsonOptions);
            await PatchGist(json, ct);

            logger.LogInformation(
                "Published: {Up}/{Total} services up, uptime {Days:F1}d",
                snapshot.ServicesUp, snapshot.ServicesTotal, snapshot.UptimeDays);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            // Shutting down — let it propagate.
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Publish failed; will retry in {Interval}", PublishInterval);
        }
    }

    private async Task<StatusSnapshot> BuildSnapshot(CancellationToken ct)
    {
        var uptimeDays = ReadHostUptimeDays();
        var (up, total) = await ReadContainerCounts(ct);
        var state = ReadState();

        return new StatusSnapshot(
            UpdatedAt:       DateTime.UtcNow.ToString("O"),
            UptimeDays:      Math.Round(uptimeDays, 2),
            ServicesUp:      up,
            ServicesTotal:   total,
            LastIncident:    state.LastIncident,
            LastRestoreTest: state.LastRestoreTest);
    }

    private sealed record State(
        [property: JsonPropertyName("lastIncident")]    string? LastIncident,
        [property: JsonPropertyName("lastRestoreTest")] string? LastRestoreTest);

    // The state file wins when it exists; env vars are the fallback for
    // setups without it.
    private State ReadState()
    {
        if (File.Exists(StatePath))
        {
            try
            {
                var state = JsonSerializer.Deserialize<State>(File.ReadAllText(StatePath));
                if (state is not null)
                    return state with
                    {
                        LastIncident    = NullIfEmpty(state.LastIncident),
                        LastRestoreTest = NullIfEmpty(state.LastRestoreTest),
                    };
            }
            catch (Exception ex) when (ex is JsonException or IOException or UnauthorizedAccessException)
            {
                logger.LogWarning(ex, "Ignoring unreadable {Path}; using env vars", StatePath);
            }
        }

        return new State(
            NullIfEmpty(Environment.GetEnvironmentVariable("LAST_INCIDENT")),
            NullIfEmpty(Environment.GetEnvironmentVariable("LAST_RESTORE_TEST")));
    }

    // An empty env var (LAST_INCIDENT=) means "none", not an empty date.
    private static string? NullIfEmpty(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value;

    private static double ReadHostUptimeDays()
    {
        // /proc/uptime is mounted read-only from the host at container start.
        var line    = File.ReadAllText("/proc/uptime");
        var seconds = double.Parse(line.Split(' ')[0], CultureInfo.InvariantCulture);
        return seconds / 86_400;
    }

    private static async Task<(int up, int total)> ReadContainerCounts(CancellationToken ct)
    {
        // DOCKER_HOST points at the read-only socket proxy (homelab/compose.yaml).
        var dockerHost = Environment.GetEnvironmentVariable("DOCKER_HOST")
            ?? "unix:///var/run/docker.sock";
        using var client = new DockerClientConfiguration(new Uri(dockerHost)).CreateClient();

        var containers = await client.Containers.ListContainersAsync(
            new ContainersListParameters { All = true }, ct);

        return (
            up:    containers.Count(c => c.State == "running"),
            total: containers.Count);
    }

    private async Task PatchGist(string content, CancellationToken ct)
    {
        var payload = new
        {
            files = new Dictionary<string, object>
            {
                ["status.json"] = new { content }
            }
        };

        var http = httpClientFactory.CreateClient();
        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _token);
        http.DefaultRequestHeaders.UserAgent.Add(
            new ProductInfoHeaderValue("status-publisher", "1.0"));
        http.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));

        using var body = new StringContent(
            JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var response = await http.PatchAsync(
            $"https://api.github.com/gists/{_gistId}", body, ct);

        response.EnsureSuccessStatusCode();
    }

    private static string RequireEnv(string name) =>
        Environment.GetEnvironmentVariable(name)
        ?? throw new InvalidOperationException(
            $"Required environment variable '{name}' is not set. " +
            "Check your .env file and restart the container.");
}
