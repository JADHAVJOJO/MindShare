import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  // Fetch comments for a post
  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => res.data),
  });

  // Add new comment
  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]); // ✅ fixed
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    if (desc.trim() === "") return;
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      {/* Write comment */}
      <div className="write">
        <img src={currentUser.profilepic} alt="Profile" />
        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {/* Show comments */}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : data.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilepic} alt="User" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
