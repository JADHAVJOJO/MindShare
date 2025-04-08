import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query"; 
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  // UseQuery with a default empty array for data to avoid undefined errors
  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => makeRequest.get(`/posts?userId=${userId}`).then((res) => res.data),
  });
console.log(userId);
  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        "Loading..."
      ) : (
        // Optional chaining with map to ensure safe access to data
        data?.map((post, index) => <Post post={post} key={`${post.id}-${index}`} />)

      )}
    </div>
  );
};

export default Posts;

