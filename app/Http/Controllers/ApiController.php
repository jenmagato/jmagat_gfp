<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class ApiController extends Controller
{
    private $githubPersonalToken;
    private $githubUrl;

    public function __construct()
    {
        $this->githubPersonalToken = config('services.github.token');
        $this->githubUrl = config('services.github.url');
    }

    /**
     * Get GitHub user data.
     *
     * @return JsonResponse
     */
    public function getGitHubUserData(): JsonResponse
    {
        Log::info('Started getGitHubUserData method');

        $url = $this->githubUrl . '/user';
        $userData = $this->makeGitHubApiRequest($url);

        if (empty($userData)) {
            Log::info('Failed to fetch GitHub user data');
            return response()->json(['error' => 'Unable to fetch GitHub data'], 500);
        }

        Log::info('Successfully fetched GitHub user data');
        return response()->json($userData['data']);
    }

    /**
     * Make a request to GitHub API.
     *
     * @param string $url
     * @return array
     */
    private function makeGitHubApiRequest(string $url): array
    {
        Log::info("Started makeGitHubApiRequest method for URL: $url");

        try {
            $client = new Client();
            Log::info("Making request to GitHub API: $url");

            $response = $client->get($url, [
                'headers' => [
                    'Authorization' => 'token ' . $this->githubPersonalToken,
                    'Accept' => 'application/vnd.github.v3+json',
                ]
            ]);

            Log::info("Response status: " . $response->getStatusCode());
            Log::info("Response headers: " . json_encode($response->getHeaders()));

            $data = json_decode($response->getBody()->getContents(), true);

            Log::info('Successfully fetched data from GitHub API');
            return ['data' => $data];
        } catch (\Exception $e) {
            Log::error('GitHub API error: ' . $e->getMessage());
            Log::info('Failed to fetch data from GitHub API');
            return [];
        }
    }

    /**
     * Get assigned issues for a GitHub user.
     *
     * @param string $username
     * @param Request $request
     * @return JsonResponse
     */
    public function getAssignedIssues($username, Request $request): JsonResponse
    {
        Log::info(message: 'Started getAssignedIssues method');

        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $perPage = min(max((int)$perPage, 1), 100);

        $url = $this->githubUrl . '/search/issues?q=assignee:' . $username . '+state:open&per_page=' . $perPage . '&page=' . $page;
        $response = $this->makeGitHubApiRequest($url);

        if (!isset($response['data']['items'])) {
            Log::info('No issues found for user: ' . $username);
            return response()->json(['message' => 'No issues found'], 404);
        }

        $totalCount = $response['data']['total_count'];
        $totalPages = (int) ceil($totalCount / $perPage);

        $nextPageUrl = null;
        $prevPageUrl = null;

        if ($page < $totalPages) {
            $nextPageUrl = url()->current() . '?page=' . ($page + 1) . '&per_page=' . $perPage;
        }

        if ($page > 1) {
            $prevPageUrl = url()->current() . '?page=' . ($page - 1) . '&per_page=' . $perPage;
        }

        $issues = array_map(function ($issue) {
            $repoName = basename(path: parse_url($issue['repository_url'], PHP_URL_PATH));

            return [
                'username' => $issue['user']['login'],
                'number' => $issue['number'],
                'title' => $issue['title'],
                'created_at' => $issue['created_at'],
                'repository' => $repoName,
                'body' => $issue['body'],
            ];
        }, $response['data']['items']);

        Log::info('Successfully fetched assigned issues for user: ' . $username);
        Log::info('Ended getAssignedIssues method');

        return response()->json([
            'issues' => $issues,
            'pagination' => [
                'next' => $nextPageUrl,
                'prev' => $prevPageUrl,
                'total_pages' => $totalPages,
            ],
        ]);
    }

    /**
     * Get detailed information of a GitHub issue.
     *
     * @param string $username
     * @param string $repository
     * @param int $issueNumber
     * @return array
     */
    public function getIssueDetails($username, $repository, $issueNumber): array
    {
        Log::info('Started getIssueDetails method');

        $url = $this->githubUrl . "/repos/{$username}/{$repository}/issues/{$issueNumber}";
        $issue = $this->makeGitHubApiRequest($url);

        if (!isset($issue['data'])) {
            Log::info("No details found for issue #{$issueNumber} in repository {$repository}");
            Log::info('Ended getIssueDetails method');
        }

        Log::info('Successfully fetched issue details');
        Log::info('Ended getIssueDetails method');

        return [
            'number' => $issue['data']['number'],
            'title' => $issue['data']['title'],
            'created_at' => $issue['data']['created_at'],
            'body' => $issue['data']['body'],
            'repository_url' => basename(path: parse_url($issue['data']['repository_url'], PHP_URL_PATH)),
        ];
    }
}