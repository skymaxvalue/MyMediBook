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
            return await _associateRepository.RegisterAssociateAsync(request.model);
        }
    }
}
