using MediatR;
using Medicare.Application.Features.Commands.Associate;
using Medicare.Application.Helper.DocumentHelper;
using Medicare.Application.Interfaces.IAssociate;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreateAssociateCommandHandler : IRequestHandler<CreateAssociateCommand, ResponseModel>
    {
        private readonly IAssociateRepository _associateRepository;
        public CreateAssociateCommandHandler(IAssociateRepository associateRepository) 
        {
            _associateRepository = associateRepository;
        }
        public async Task<ResponseModel> Handle(CreateAssociateCommand request, CancellationToken cancellationToken)
        {
            var result = request.model;

            if(result.IdentityFile != null)
            {
                var (identityDocBytes, identityErr) = DocumentHelper.ProcessDocument(result.IdentityFile);

                if (identityErr != null)
                    return new ResponseModel() 
                    { 
                        Status = 0, 
                        ResponseMessage = $"Identity Document: {identityErr}",
                        IsSuccess = 0,
                        ResponseId = 0
                    };

                result.IdentityFile = identityDocBytes;
            }

            if (result.AssociateQualification.QualificationDocuments != null)
            {
                var (qualificationDocBytes, qualErr) = DocumentHelper.ProcessDocument(result.AssociateQualification.QualificationDocuments);

                if (qualErr != null)
                    return new ResponseModel() 
                    { 
                        Status = 0, 
                        ResponseMessage = $"Qualification Document: {qualErr}",
                        IsSuccess = 0,
                        ResponseId = 0
                    };

                result.AssociateQualification.QualificationDocuments = qualificationDocBytes;
            }
            return await _associateRepository.RegisterAssociateAsync(request.model);
        }
    }
}
