import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Change this to your actual API base URL

export const getGitHubUserData = async () => {
  const response = await axios.get(`${API_BASE_URL}/account`);
  return response.data;
};

export const getAssignedIssues = async (
  username: string,
  page: number,
  perPage: number
) => {
  const response = await axios.get(
    `${API_BASE_URL}/issues/${username}?page=${page}&per_page=${perPage}`
  );
  return response.data; // Return issues and pagination data
};

export const getIssueDetails = async (
  username: string,
  repository: string,
  issueNumber: number
) => {
  const response = await axios.get(
    `${API_BASE_URL}/issues/${username}/${repository}/${issueNumber}`
  );
  return response.data;
};
