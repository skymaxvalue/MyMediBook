using MediatR;
using Medicare.Application.Models.CommonModels.ErrorLog;
using System;
using System.Collections.Generic;
using System.Text;

namespace Medicare.Application.Features.Commands.ErrorLog
{
    public record ErrorLogCommand(ErrorLogModel Model) : IRequest<ErrorLogModel>;   
}
