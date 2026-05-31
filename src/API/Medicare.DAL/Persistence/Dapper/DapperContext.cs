using Dapper;
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using Medicare.Application.Interfaces.Dapper;
using Microsoft.Extensions.Logging;
using Medicare.Application.Models.CommonModels.ErrorLog;

namespace Medicare.DAL.Persistence.Dapper
{
    public class DapperContext
    {
        private readonly IDbConnectionFactory _factory;
        private readonly ILogger<DapperContext> _logger;
        private ErrorLogModel errorLog;
        public DapperContext(IDbConnectionFactory factory, ILogger<DapperContext> logger)
        {
            _factory = factory;
            _logger = logger;
        }
        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object param = null)
        {
            using var connection = _factory.CreateConnection();
            return await connection.QueryAsync<T>(sql, param, commandType: CommandType.Text);
        }

        public async Task<T> QuerySingleAsync<T>(string sql, object param = null)
        {
            using var connection = _factory.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<T>(sql, param, commandType: CommandType.Text);
        }

        public async Task<IEnumerable<T>> QueryStoredProcAsync<T>(string procName, object param = null)
        {
            using var connection = _factory.CreateConnection();
            return await connection.QueryAsync<T>(procName, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<T> QuerySingleStoredProcAsync<T>(string procName, object param = null)
        {
            using var connection = _factory.CreateConnection();
             return await ExecuteWithLoggingAync(async (connection) =>
                await connection.QueryFirstOrDefaultAsync<T>(procName, param, commandType: CommandType.StoredProcedure), procName, param
            ); 
        }

        public async Task<int> ExecuteStoredProcAsync(string procName, object param = null)
        {
            using var connection = _factory.CreateConnection();
            return await ExecuteWithLoggingAync(async (connection) =>
                await connection.ExecuteAsync(procName, param, commandType: CommandType.StoredProcedure), procName, param
            ); 
        }
        public async Task<List<T>> QueryStoredProcListAsync<T>(string procName, object param = null)
        {
            using var connection = _factory.CreateConnection();
            var result = await ExecuteWithLoggingAync(async (connection) =>
                await connection.QueryAsync<T>(procName, param, commandType: CommandType.StoredProcedure), procName, param);

            return result.ToList();
        }

        private async Task<TResult> ExecuteWithLoggingAync<TResult>(Func<IDbConnection, Task<TResult>> databaseOperation, string sql, object param)
        {
            try
            {
                using var connection = _factory.CreateConnection();
                if(connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                }

                return await databaseOperation(connection);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Database Operation Failed. ProcName: {sql}. Parameters: {@Params}", sql, param);

                throw;
            }
        }
    }
}
