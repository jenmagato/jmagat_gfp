import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getIssueDetails } from "../api";
import { Issue } from "../types";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

const IssueDetails: React.FC = () => {
  const { username, repository, id } = useParams();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!username || !repository || !id) return;

      try {
        const issueDetails = await getIssueDetails(
          username,
          repository,
          Number(id)
        );
        setIssue(issueDetails);
      } catch (err) {
        setError("Failed to fetch issue details");
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [username, repository, id]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error) return <div>{error}</div>;
  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {issue && (
          <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <Link to="/" style={{ textDecoration: "none" }}>
                  <IconButton color="primary">
                    <ArrowBack />
                  </IconButton>
                </Link>
                <Typography variant="h5" sx={{ marginLeft: 1 }}>
                  Issue Details
                </Typography>
              </Box>

              <Typography variant="h4" gutterBottom>
                {issue.title}
              </Typography>

              <Typography variant="body1" color="textSecondary">
                Issue #{issue.number} - Created on{" "}
                {new Date(issue.created_at).toLocaleDateString()}
              </Typography>

              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

              <Typography variant="body1" paragraph>
                <ReactMarkdown>
                  {issue.body || "No description available"}
                </ReactMarkdown>
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default IssueDetails;
