using MediatR;
using Medicare.Application.Features.Commands.Patient;
using Medicare.Application.Interfaces.IPatient;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Patient;
using System.Security.Cryptography;
using System.Text;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, ResponseModel>
    {
        private readonly IPatientRepository _patientRepository;

        public CreatePatientCommandHandler(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        public async Task<ResponseModel> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
        {
            CreateHash(request.model.Password, out byte[] passwordHash, out byte[] passwordSalt);

            CreateHash(request.model.SecurityAnswer, out byte[] answerHash, out byte[] answerSalt);

            var patientModel = new PatientMasterModel
                {
                PatientId = request.model.PatientId,
                FirstName = request.model.FirstName,
                MiddleName = request.model.MiddleName,
                LastName = request.model.LastName,
                DateOfBirth = request.model.DateOfBirth,
                PhoneNumber = request.model.PhoneNumber,
                Email = request.model.Email,
                Gender = request.model.Gender,
                AddressLine1 = request.model.AddressLine1,
                AddressLine2 = request.model.AddressLine2,
                CityId = request.model.CityId,
                ZipCode = request.model.ZipCode,
                StateId = request.model.StateId,
                CountryId = request.model.CountryId,
                Username = request.model.Username,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                SecurityQuestionId = request.model.SecurityQuestionId,
                SecurityAnswerHash = answerHash,   
                SecurityAnswerSalt = answerSalt,   
                IsActive = request.model.IsActive,
                CreatedBy = request.model.CreatedBy,
                CreatedDate = request.model.CreatedDate,
                UpdatedBy = request.model.UpdatedBy,
                UpdatedDate = request.model.UpdatedDate
            };

            return await _patientRepository.CreatePatientDetails(patientModel);
        }
        private static void CreateHash(string value, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(value));
        }
    }
}
