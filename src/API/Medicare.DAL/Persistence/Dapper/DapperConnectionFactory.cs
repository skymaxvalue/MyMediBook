using Medicare.Application.Interfaces.Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Medicare.DAL.Persistence.Dapper
{
    public class DapperConnectionFactory : IDbConnectionFactory
    {
        private readonly string _connectionString;
        public DapperConnectionFactory(string connectionString) 
        {
            _connectionString = connectionString;
            var builder = new SqlConnectionStringBuilder(connectionString)
            {
                MinPoolSize = 5,
                MaxPoolSize = 100,
                ConnectTimeout = 30,
                Pooling = true
            };
            _connectionString = builder.ConnectionString;
        }
        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
        public async Task<IDbConnection> CreateOpenConnectionAsync()
        {
            var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();       
            return connection;
        }
    }
}
