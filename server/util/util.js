/**
 *
 * @param dbName
 * @param collectionName
 * @param counts
 * @param pageIdx
 * @param pageSize
 */
const logQuery = function(dbName, collectionName, counts, pageIdx, pageSize) {
  console.log(`[query data]:[${dbName}:${collectionName}], total : ${counts} , pageIdx:${pageIdx}, pageSize:${pageSize}`);
};
/**
 *
 * @param dbName
 * @param collectionName
 * @param params
 */
const logQueryForParams = function(dbName, collectionName, params = {}) {
  console.log(`[query data]:[${dbName}:${collectionName}], params: ${JSON.stringify(params)}`);
};


module.exports = {logQuery, logQueryForParams, arrayContains};
