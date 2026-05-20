using MediatR;
using Medicare.Application.Features.Queries.ErrorLog;
using Medicare.Application.Features.Queries.User;
using Medicare.Application.Interfaces.IErrorLog;
using Medicare.Application.Interfaces.UserRepository;
using Medicare.Application.Models.CommonModels.ErrorLog;
using Medicare.Application.Models.User;
using System;
using System.Collections.Generic;
using System.Text;

namespace Medicare.Application.Handlers.QueryHandlers
{
    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery,UserInfoDataModel>
    {
        private readonly IUserRepository _userRepository;
        public GetUserByIdQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<UserInfoDataModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            return await _userRepository.GetUserByIdAsync(request.Id);
        }
    }
}
