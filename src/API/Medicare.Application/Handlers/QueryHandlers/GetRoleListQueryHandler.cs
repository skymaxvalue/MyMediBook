using MediatR;
using Medicare.Application.Features.Queries.Role;
using Medicare.Application.Interfaces.IRoles;
using Medicare.Application.Models.Role;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetRoleListQueryHandler : IRequestHandler<GetRoleListQuery, List<RoleDataModel>>
    {
        private readonly IRoleRepository _roleRepository;

        public GetRoleListQueryHandler(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        public async Task<List<RoleDataModel>> Handle(GetRoleListQuery request, CancellationToken cancellationToken)
        {
            return await _roleRepository.GetRoleListAsync();
        }
    }
}
