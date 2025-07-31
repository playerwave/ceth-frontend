import React from 'react';
import { Box, Typography } from '@mui/material';

interface ToggleProps {
  isPublic: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ isPublic, onToggle, disabled = false }) => {
  return (
    <Box
      onClick={disabled ? undefined : onToggle}
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: isPublic ? "#22c55e" : "#ef4444",
        color: "white",
        px: 2,
        py: 1,
        borderRadius: "9999px",
        fontSize: 14,
        fontWeight: 600,
        gap: 1.5,
        minWidth: "90px",
        justifyContent: "space-between",
        cursor: disabled ? "not-allowed" : "pointer",
        height: 32,
        transition: "all 0.2s ease-in-out",
        opacity: disabled ? 0.6 : 1,
        "&:hover": disabled ? {} : {
          transform: "scale(1.02)",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        },
      }}
    >
      {isPublic ? (
        <>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Public
          </Typography>
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              border: "1px solid rgba(0,0,0,0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": disabled ? {} : {
                transform: "scale(1.1)",
                boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
              },
            }}
          />
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              border: "1px solid rgba(0,0,0,0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": disabled ? {} : {
                transform: "scale(1.1)",
                boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
              },
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Private
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Toggle; 