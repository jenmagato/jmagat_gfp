import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const [pageLoading, setPageLoading] = useState(false);

  const handlePageChange = (page: number) => {
    if (page !== currentPage && !pageLoading) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    if (currentPage > 1 && currentPage < totalPages) {
      pageNumbers.push(currentPage);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    if (totalPages > 1) pageNumbers.push(totalPages);
    return pageNumbers;
  };

  useEffect(() => {
    if (loading) {
      setPageLoading(true);
    } else {
      setPageLoading(false);
    }
  }, [loading]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1 || pageLoading}
        sx={{ marginRight: 1 }}
      >
        Prev
      </Button>

      <Button
        variant="outlined"
        color="primary"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || pageLoading}
      >
        First
      </Button>

      {getPageNumbers().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "contained" : "outlined"}
          color="primary"
          onClick={() =>
            typeof page === "number" ? handlePageChange(page) : null
          }
          disabled={pageLoading}
          sx={{
            marginLeft: 1,
            minWidth: "40px",
            textTransform: "none",
            fontWeight: page === currentPage ? "bold" : "normal",
            backgroundColor: page === currentPage ? "#1976d2" : "transparent",
            color: page === currentPage ? "#fff" : "inherit",
          }}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outlined"
        color="primary"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || pageLoading}
        sx={{ marginLeft: 1 }}
      >
        Last
      </Button>

      <Button
        variant="outlined"
        color="primary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || pageLoading}
        sx={{ marginLeft: 1 }}
      >
        Next
      </Button>
    </Box>
  );
};

export default PaginationComponent;
