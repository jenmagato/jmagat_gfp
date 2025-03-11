import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGitHubUserData, getAssignedIssues } from "../api";
import { GitHubUser, Issue } from "../types";
import {
  Button,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import { ArrowForward, Refresh } from "@mui/icons-material";
import { useTheme } from "@mui/system";
import PaginationComponent from "../component/PaginationComponent";

const Account: React.FC = () => {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [assignedIssues, setAssignedIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [perPage] = useState<number>(10);

  const theme = useTheme();

  const fetchData = async () => {
    try {
      setPageLoading(true);

      const user = await getGitHubUserData();
      setUserData(user);

      const response = await getAssignedIssues(
        user.login,
        currentPage,
        perPage
      );
      setAssignedIssues(response.issues);
      setTotalPages(response.pagination.total_pages);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setPageLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const refreshIssues = async () => {
    setPageLoading(true);
    setAssignedIssues([]);
    await fetchData();
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={3} justifyContent="center">
          {userData && (
            <Grid item xs={12} sm={10} md={8}>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "2rem",
                  [theme.breakpoints.up("sm")]: { fontSize: "3rem" },
                }}
                gutterBottom
              >
                Welcome {userData.login}
              </Typography>
              <Card>
                <CardContent
                  sx={{
                    display: "flex",
                    [theme.breakpoints.up("sm")]: { flexDirection: "row" },
                  }}
                >
                  <Avatar
                    src={userData.avatar_url}
                    alt={userData.login}
                    sx={{
                      width: 80,
                      height: 80,
                      [theme.breakpoints.up("sm")]: { width: 100, height: 100 },
                    }}
                  />
                  <div
                    style={{
                      paddingLeft: 16,
                      textAlign: "left",
                      [theme.breakpoints.up("sm")]: { paddingLeft: 32 },
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      {userData.name || "No Name Provided"}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      {userData.bio || "No bio available"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Location: {userData.location || "N/A"}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      href={userData.html_url}
                      target="_blank"
                      sx={{
                        fontSize: "0.875rem",
                        [theme.breakpoints.up("sm")]: { fontSize: "1rem" },
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <br></br>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "1.25rem",
                  [theme.breakpoints.up("sm")]: { fontSize: "1.5rem" },
                }}
                gutterBottom
              >
                Assigned Issues
                <IconButton
                  onClick={refreshIssues}
                  sx={{
                    marginLeft: 1,
                    padding: 0,
                    fontSize: "1.5rem",
                  }}
                >
                  <Refresh />
                </IconButton>
              </Typography>

              <div className="list-group">
                {pageLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                      marginBottom: 8,
                      height: "50px", // Adjust the height to match the loader size
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : assignedIssues.length > 0 ? (
                  assignedIssues.map((issue) => (
                    <div
                      key={issue.number}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 8,
                        marginBottom: 8,
                        border: "1px solid #e0e0e0",
                        borderRadius: 4,
                      }}
                    >
                      <Link
                        to={`/issue/${userData.login}/${issue.repository}/${issue.number}`}
                        className="text-decoration-none"
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {issue.title}
                        </span>{" "}
                        (Issue #{issue.number})
                      </Link>
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`/issue/${userData.login}/${issue.repository}/${issue.number}`}
                        endIcon={<ArrowForward />}
                      >
                        View Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: 8,
                      marginBottom: 8,
                      border: "1px solid #e0e0e0",
                      borderRadius: 4,
                    }}
                  >
                    No assigned issues
                  </div>
                )}
              </div>
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                loading={pageLoading}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Account;
