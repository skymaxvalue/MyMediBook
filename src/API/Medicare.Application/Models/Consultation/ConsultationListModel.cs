using Medicare.Application.Interfaces.IErrorHandling;
using System.Text.Json.Serialization;

public class ConsultationListItemModel
{
    public int ConsultationId { get; set; }
    public string? ConsultationRefNo { get; set; }
    public int? AppointmentId { get; set; }

    public int PatientId { get; set; }
    public int ProfileId { get; set; }
    public string? PatientName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? PhoneNumber { get; set; }

    public DateTime? PreferredDate { get; set; }
    public string? PreferredTime { get; set; }
    public string? ConsultationMode { get; set; }
    public string? VisitType { get; set; }
    public string? VisitPurpose { get; set; }

    public string? ChiefComplaint { get; set; }
    public string? Urgency { get; set; }
    public int? PainLevel { get; set; }

    public int ConsultationStatusId { get; set; }
    public string? ConsultationStatus { get; set; }
    public bool? IsCheckedIn { get; set; }
    public string? QueueStatus { get; set; }

    public DateTime? SubmittedDate { get; set; }
    public DateTime CreatedDate { get; set; }

    [JsonIgnore]
    public int TotalCount { get; set; }         
}

public class ConsultationListResponseModel : IErrorHandling
{
    public int IsSuccess { get; set; }
    public int Status { get; set; }
    public string? ResponseMessage { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public List<ConsultationListItemModel> Items { get; set; } = new();
}