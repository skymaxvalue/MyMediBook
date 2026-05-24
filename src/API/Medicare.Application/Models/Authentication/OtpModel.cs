using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Medicare.Application.Models.Authentication
{
    public class OtpDetailModel
    {
        public string Email { get; set; }
        [JsonIgnore]
        public byte[] OtpHash { get; set; }   // store hash, not raw OTP
        [JsonIgnore]
        public byte[] OtpSalt { get; set; }
        public DateTime Expiry { get; set; }
        public int OtpAttempts { get; set; }
    }
    public class RequestOtpModel
    {
        public string Email { get; set; }
    }

    public class VerifyOtpModel
    {
        public string Email { get; set; }
        public string OtpCode { get; set; }
    }
}
