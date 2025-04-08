import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const queryClient = useQueryClient();

  // Fetch user data
  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await makeRequest.get(`/users/find/${userId}`);
      return res.data;
    },
  });

  // Fetch relationship data
  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: async () => {
      const res = await makeRequest.get(`/relationships?followedUserId=${userId}`);
      return res.data;
    },
  });

  // Follow/unfollow mutation
  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following) {
        return makeRequest.delete(`/relationships?userId=${userId}`);
      } else {
        return makeRequest.post("/relationships", { userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", userId] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData?.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <div className="images">
            <img src={data.coverPic} alt="Cover" className="cover" />
            <img src={data.profilePic} alt="Profile" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FacebookTwoToneIcon fontSize="medium" />
                </a>
                <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon fontSize="medium" />
                </a>
                <a href="http://twitter.com" target="_blank" rel="noopener noreferrer">
                  <TwitterIcon fontSize="medium" />
                </a>
                
              </div>
              <div className="center">
                <span style={{fontWeight:"bold"}}>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span ><a href={data.website} style={{color:"white",textDecoration: "none"}} target="_blank" rel="noopener noreferrer">WebSite
                </a></span>
                  </div>
                </div>
                {rIsLoading ? (
                  "Loading..."
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData?.includes(currentUser.id) ? "Following" : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                {/* <EmailOutlinedIcon /> */}
                {/* <MoreVertIcon /> */}
                <a href="http://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon fontSize="medium" style={{color:"white"}}/>
                </a>
                <a href="http://github.com" target="_blank" rel="noopener noreferrer">
                <GitHubIcon fontSize="medium" style={{color:"white"}}/>

                </a>
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
