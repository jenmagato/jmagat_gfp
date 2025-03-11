<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

// Define the API route
Route::get('account', action: [ApiController::class, 'getGitHubUserData']);
Route::get('/issues/{username}', [ApiController::class, 'getAssignedIssues']);
Route::get('issues/{username}/{repository}/{issueNumber}', [ApiController::class, 'getIssueDetails']);