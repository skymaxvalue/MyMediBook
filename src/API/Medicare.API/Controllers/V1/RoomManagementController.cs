using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [Authorize]
    public class RoomManagementController : BaseApiController
    {
        private readonly IMediator _mediator;
        public RoomManagementController(IMediator mediator) 
        {
            _mediator = mediator;
        }
    }
}
