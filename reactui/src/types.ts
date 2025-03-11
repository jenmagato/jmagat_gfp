// types.ts

// GitHub User data structure
export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
  created_at: string;
  updated_at: string;
  location: string;
}

// Issue data structure
export interface Issue {
  number: number;
  title: string;
  repository: string;
  created_at: string;
  body: string;
  repository_url: string;
  // You can add other fields you want to display from the issue data here
}
