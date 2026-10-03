using MediatR;
using Medicare.Application.Features.Commands.Lab;
using Medicare.Application.Interfaces.ILab;
using Medicare.Application.Models.CommonModels.ResponseModel;

namespace Medicare.Application.Handlers.CommandHandlers
{
    public class CreateLabOrderCommandHandler : IRequestHandler<CreateLabOrderCommand, ResponseModel>
    {
        private readonly ILabRepository _labRepository;
        public CreateLabOrderCommandHandler(ILabRepository labRepository)
        {
            _labRepository = labRepository;
        }
        public async Task<ResponseModel> Handle(CreateLabOrderCommand request, CancellationToken cancellationToken)
        {
            return await _labRepository.CreateLabOrderAsync(request.model);
        }
    }
}
