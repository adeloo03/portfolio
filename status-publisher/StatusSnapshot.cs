using System.Text.Json.Serialization;

namespace StatusPublisher;

public sealed record StatusSnapshot(
    [property: JsonPropertyName("updatedAt")]       string  UpdatedAt,
    [property: JsonPropertyName("uptimeDays")]      double  UptimeDays,
    [property: JsonPropertyName("servicesUp")]      int     ServicesUp,
    [property: JsonPropertyName("servicesTotal")]   int     ServicesTotal,
    [property: JsonPropertyName("lastIncident")]    string? LastIncident,
    [property: JsonPropertyName("lastRestoreTest")] string? LastRestoreTest
);
