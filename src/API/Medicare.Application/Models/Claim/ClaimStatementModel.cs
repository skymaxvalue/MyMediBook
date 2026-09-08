using Medicare.Application.Interfaces.IErrorHandling;
using System;
using System.Collections.Generic;
using System.Text;

namespace Medicare.Application.Models.Claim
{
    //  Generate Patient Statement
    public class GenerateStatementResponse : IErrorHandling
    {
        public int StatementId { get; set; }
        public int ClaimId { get; set; }
        public decimal TotalCharge { get; set; }
        public decimal InsurancePaid { get; set; }
        public decimal Adjustments { get; set; }
        public decimal CopayCollected { get; set; }
        public decimal RemainingBalance { get; set; }
        public DateTime StatementDate { get; set; }
        public int IsSuccess { get; set; }
        public string ResponseMessage { get; set; } = string.Empty;
    }
}
