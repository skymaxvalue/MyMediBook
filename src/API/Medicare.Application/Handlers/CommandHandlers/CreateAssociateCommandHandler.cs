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
            var associate = request.model;

            if (associate != null)
            {
                var (qualificationDocBytes, error) = DocumentHelper.ProcessDocument(associate.AssociateQualification.QualificationDocuments);
                var (identityDocBytes, err) = DocumentHelper.ProcessDocument(associate.IdentityFile);

                if (error != null)
                    return new ResponseModel()
                    { 
                        Status = 0, 
                        IsSuccess = 0,
                        ResponseId = 0,
                        ResponseMessage = error
                    };

                associate.AssociateQualification.QualificationDocumentsBytes = qualificationDocBytes;
                associate.IdentityFileBytes= identityDocBytes;
            }
            return await _associateRepository.RegisterAssociateAsync(request.model);
        }
    }
}
