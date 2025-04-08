import "./post.scss";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import Comments from "../comments/Comments";

import {
  FavoriteBorderOutlined as FavoriteBorderIcon,
  FavoriteOutlined as FavoriteIcon,
  TextsmsOutlined as CommentIcon,
  ShareOutlined as ShareIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch likes data
  const { data: likes = [], isLoading } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      const response = await makeRequest.get(`/likes?postId=${post.id}`);
      return response.data;
    },
  });

  // Mutation for liking a post
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (likes.includes(currentUser.id)) {
        await makeRequest.delete(`/likes?postId=${post.id}`);
      } else {
        await makeRequest.post("/likes", { postId: post.id });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["likes", post.id] }),
  });

  // Mutation for deleting a post
  const deleteMutation = useMutation({
    mutationFn: async () => await makeRequest.delete(`/posts/${post.id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
          <img src={currentUser.profilepic} alt="" />

            <div className="details">
            <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={() => deleteMutation.mutate()}>Delete</button>
          )}
        </div>

        <div className="content">
          <p>{post.desc}</p>
          {post.image && <img src={`/upload/${post.image}`} alt="Post" />}
        </div>

        <div className="info">
          <div className="item" onClick={() => likeMutation.mutate()}>
            {isLoading ? (
              "Loading..."
            ) : likes.includes(currentUser.id) ? (
              <FavoriteIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
            {likes.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <CommentIcon /> See Comments
          </div>
          <div className="item">
            <ShareIcon /> Share
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
