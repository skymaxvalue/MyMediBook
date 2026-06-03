using MediatR;
using Medicare.Application.Features.Queries.Location;
using Medicare.Application.Models.CommonModels.ResponseModel;
using Medicare.Application.Models.Location;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Medicare.API.Controllers.V1
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class LocationController : Controller
    {
        private readonly IMediator _mediator;
        public LocationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetCountriesList")]
        public async Task<IActionResult> GetCountriesList()
        {
            ApiResponse<List<CountryModel>> ApiResponse = new ApiResponse<List<CountryModel>>();
            List<CountryModel> response = new List<CountryModel>();
            response = await _mediator.Send(new GetCountriesQuery());
            ApiResponse = new ApiResponse<List<CountryModel>>()
            {
                Data = response,
                StatusMessage = "Countries Fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetStatesByCountryList/{countryId}")]
        public async Task<IActionResult> GetStatesByCountryList(int countryId)
        {
            ApiResponse<List<StateModel>> ApiResponse = new ApiResponse<List<StateModel>>();
            List<StateModel> response = new List<StateModel>();
            response = await _mediator.Send(new GetStatesQuery(countryId));
            ApiResponse = new ApiResponse<List<StateModel>>()
            {
                Data = response,
                StatusMessage = "States Fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }

        [HttpGet]
        [Route("GetCitiesByStateList/{stateId}")]
        public async Task<IActionResult> GetCitiesByStateList(int stateId)
        {
            ApiResponse<List<CityModel>> ApiResponse = new ApiResponse<List<CityModel>>();
            List<CityModel> response = new List<CityModel>();
            response = await _mediator.Send(new GetCitiesQuery(stateId));
            ApiResponse = new ApiResponse<List<CityModel>>()
            {
                Data = response,
                StatusMessage = "Cities Fetched Successfully",
                StatusCode = HttpStatusCode.OK,
                Result = 1
            };
            return Ok(ApiResponse);
        }
    }
}
