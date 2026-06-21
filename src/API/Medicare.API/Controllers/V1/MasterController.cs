using MediatR;
using Medicare.Application.Features.Queries.Master;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Master;
using Medicare.Application.Models.MasterModels;
using Medicare.Application.Models.Speciality;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class MasterController : Controller
    {
        private readonly IMediator _mediator;
        public MasterController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetWeekDaysList")]
        public async Task<IActionResult> GetWeekDaysList()
        {
            ApiResponse<List<WeekDaysModel>> ApiResponse = new ApiResponse<List<WeekDaysModel>>();
            List<WeekDaysModel> response = new List<WeekDaysModel>();
            response = await _mediator.Send(new GetWeekDaysListQuery());
            ApiResponse = new ApiResponse<List<WeekDaysModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetRoleList")]
        public async Task<IActionResult> GetRoleList()
        {
            ApiResponse<List<RoleDataModel>> ApiResponse = new ApiResponse<List<RoleDataModel>>();
            List<RoleDataModel> response = new List<RoleDataModel>();
            response = await _mediator.Send(new GetRoleListQuery());
            ApiResponse = new ApiResponse<List<RoleDataModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetDepartmentByRoleId/{roleId}")]
        public async Task<IActionResult> GetDepartmentByRoleId(int roleId)
        {
            ApiResponse<List<DepartmentDataModel>> ApiResponse = new ApiResponse<List<DepartmentDataModel>>();
            List<DepartmentDataModel> response = new List<DepartmentDataModel>();
            response = await _mediator.Send(new GetDepartmentByRoleIdQuery(roleId));
            ApiResponse = new ApiResponse<List<DepartmentDataModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetSpecialityByDepartmentId/{departmentId}")]
        public async Task<IActionResult> GetSpecialityByDepartmentId(int departmentId)
        {
            ApiResponse<List<SpecialityTypeModel>> ApiResponse = new ApiResponse<List<SpecialityTypeModel>>();
            List<SpecialityTypeModel> response = new List<SpecialityTypeModel>();
            response = await _mediator.Send(new GetSpecialityByDepartmentIdQuery(departmentId));
            ApiResponse = new ApiResponse<List<SpecialityTypeModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetDesignationByRoleId/{roleId}")]
        public async Task<IActionResult> GetDesignationByRoleId(int roleId)
        {
            ApiResponse<List<DesignationDataModel>> ApiResponse = new ApiResponse<List<DesignationDataModel>>();
            List<DesignationDataModel> response = new List<DesignationDataModel>();
            response = await _mediator.Send(new GetDesignationByRoleIdQuery(roleId));
            ApiResponse = new ApiResponse<List<DesignationDataModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetRoleDepartmentSpecialityList")]
        public async Task<IActionResult> GetRoleDepartmentSpecialityList()
        {
            ApiResponse<List<RoleHierarchyModel>> ApiResponse = new ApiResponse<List<RoleHierarchyModel>>();
            List<RoleHierarchyModel> response = new List<RoleHierarchyModel>();
            response = await _mediator.Send(new GetRoleDepartmentSpecialityListQuery());
            ApiResponse = new ApiResponse<List<RoleHierarchyModel>>
            {
                Data = response,
                StatusMessage = "Data fetched successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
    }
}
