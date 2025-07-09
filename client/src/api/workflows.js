import axios from 'axios';

const BASE_URL = '/api/v1/workflows';

/**
 * Create a new workflow definition.
 * @param {{ name: string; graph_json: string }} payload
 * @returns {Promise} Axios response
 */
export function createWorkflow(payload) {
  return axios.post(BASE_URL, payload);
}

/**
 * Execute a workflow definition.
 * @param {{ graph_json: string }} payload
 * @returns {Promise} Axios response with execution result
 */
export function executeWorkflow(payload) {
  return axios.post(`${BASE_URL}/execute`, payload);
}