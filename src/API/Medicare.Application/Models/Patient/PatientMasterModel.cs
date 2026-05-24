using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Medicare.Application.Models.Patient
{
    public class PatientMasterModel
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string? Gender { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public int CityId { get; set; }
        public string ZipCode { get; set; }
        public int? StateId { get; set; }
        public int CountryId { get; set; }
        public string Username { get; set; }
        [JsonIgnore]
        public byte[] PasswordHash { get; set; }
        [JsonIgnore]
        public byte[] PasswordSalt { get; set; }
        public int SecurityQuestionId { get; set; }
        [JsonIgnore]
        public byte[] SecurityAnswerHash { get; set; } 
        [JsonIgnore]
        public byte[] SecurityAnswerSalt { get; set; } 
        public bool IsActive { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }

    public class CreatePatientRequestModel  //PATIENT REQUEST DTO MODEL
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string? Gender { get; set; }
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public int CityId { get; set; }
        public string ZipCode { get; set; }
        public int? StateId { get; set; }
        public int CountryId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; } 
        public string SecurityAnswer { get; set; } 
        public int SecurityQuestionId { get; set; }
        public bool IsActive { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
