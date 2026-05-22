using MediatR;
using Medicare.Application.Models.Authentication;
using Medicare.Application.Models.CommonModels.ResponseModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace Medicare.Application.Features.Commands.Authentication
{
    public record RequestOtpCommand(RequestOtpModel Model) : IRequest<ResponseModel>;
}
