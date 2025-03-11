# gfp

# Project Setup

This project involves both a **Laravel** backend and a **React** frontend. Below are the instructions on how to set up the environment and run the applications.

## Prerequisites

-   **Node.js** (for React)
-   **npm** (for React)
-   **Composer** (for Laravel)
-   **PHP** (for Laravel)
-   **GitHub Personal Access Token** (for interacting with GitHub repositories)

Make sure to have all the necessary dependencies installed before proceeding.

## 1. Set up GitHub Personal Access Token

The project requires a `GITHUB_PERSONAL_TOKEN` to authenticate with GitHub. Follow the instructions below to create and set up the token.

### Steps to Create a GitHub Personal Access Token

1. Go to [GitHub's Personal Access Token page](https://github.com/settings/tokens).
2. Click **Generate token** at the bottom of the page.
3. Copy the token and store it securely as you will not be able to view it again.

## 2. Running the Laravel Backend

Make sure you have PHP and Composer installed on your system to run the Laravel app.

### Steps to Set Up and Run the Laravel App

1. Clone the repository:

    ```bash
    git clone https://github.com/jenmagato/jmagat_gfp.git
    cd jmagat_gfp
    ```

2. Install PHP dependencies using Composer:
    ```bash
    composer install
    ```
3. Set up the environment variables by copying the .env.example to .env:

    ```bash
    cp .env.example .env
    ```

    ## How to Set the `GITHUB_PERSONAL_TOKEN` in Your Environment

    ### On Local Development (using `.env` file):

    1. Create a `.env` file in your project root directory (if it doesn't already exist).
    2. Add the following line to the `.env` file:

    ```bash
    GITHUB_PERSONAL_TOKEN="your_personal_token_here"
    ```

4. Set up Application Key (not used since only the API was used -- can be skipped)
   Generate a new application key. This will set the APP_KEY in your .env file:
    ```bash
    php artisan key:generate
    ```
6. Set up Database (not used since only the API was used -- can be skipped)
    ```bash
    php artisan migrate
    ```
7. Start the Laravel development server:
    ```bash
    php artisan serve
    ```
    Laravel API will be available at http://localhost:8000/api (but only for API calls, not for frontend UI).

-   http://localhost:8000/api/account
-   http://localhost:8000/api/issues/{username}
-   http://localhost:8000/api/issues/{username}/{repo}/issues/{issuenumber}

## 3. Running the React Frontend

Make sure you have Node.js and npm installed on your system to run the React app.

### Steps to Set Up and Run the React App

1. Navigate to the React app directory (usually under the frontend or client folder):
    ```bash
    cd reactui
    ```
2. Install dependencies using npm:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm start
    ```
4. The React app will be available at http://localhost:3000.

## Troubleshooting

If you encounter any issues related to the GitHub Personal Access Token (e.g., authentication errors), make sure the token has the correct permissions.
For Laravel issues, check your PHP version and ensure all required extensions are installed.
For React issues, check the terminal output for any missing dependencies or errors.

## Additional Notes

Laravel is used as an API only, and does not have any UI. The React app (running on localhost:3000) interacts with the Laravel API.
