// ✅ All imports go at the top
import React, { useContext } from "react";
import "./Memories.scss";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import Post from "../../components/post/Post"; // ✅ Moved here

const Memories = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const res = await makeRequest.get("/posts");
      return res.data.filter((post) => post.userId === currentUser.id);
    },
  });

  return (
    <div className="memories dark-theme">
      <h2>Your Memories</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        data.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Memories;
