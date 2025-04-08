import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query"; 
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({postId}) => {
  const [desc,setDesc]=useState("")
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => makeRequest.get("/comments?postId="+postId).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };
 
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilepic} alt="" />
        <input type="text" 
        placeholder="write a comment"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? "Loading" :
       data.map((comments) => (
        <div className="comment">
          <img src={comments.profilepic} alt="" />
          <div className="info">
            <span>{comments.name}</span>
            <p>{comments.desc}</p>
          </div>
          <span className="date">{moment(comments.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
