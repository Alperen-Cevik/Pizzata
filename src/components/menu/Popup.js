import React from "react";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Popup({
  togglePopup,
  setStar,
  star,
  setComment,
  comment,
}) {
  return (
    <div className="popup">
      <div className="overlay">
        <div className="popup-content">
          <Box
            sx={{
              "& > legend": {
                mt: 2,
                fontSize: "2.2rem",
                marginLeft: "5rem",
                width: "20rem",
                color: "#B9201C",
                fontWeight: "700",
              },

              "& .MuiRating-icon": {
                fontSize: "4rem",
                marginLeft: "1rem",
                textAlign: "center",
              },
            }}
          >
            <Typography component="legend">Rate the order</Typography>
            <Rating
              size="large"
              name="simple-controlled"
              value={star}
              onChange={(event, newValue) => {
                setStar(newValue || 0);
              }}
            />
          </Box>

          <textarea
            placeholder="Leave a comment"
            value={comment}
            onChange={(ev, newComment) => setComment(ev.target.value)}
          />
          <button
            onClick={togglePopup}
            className="button hover:bg-green-600 hover:text-white"
          >
            Submit
          </button>
          <button className="close-popup" onClick={togglePopup}>
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}
