using Medicare.Application.Interfaces.Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Medicare.DAL.Persistence.Dapper
{
    public class DapperConnectionFactory : IDbConnectionFactory
    {
        private readonly IConfiguration _config;
        public DapperConnectionFactory(IConfiguration config) 
        {
            _config = config;
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_config.GetConnectionString("Default"));
        }
    }
}
