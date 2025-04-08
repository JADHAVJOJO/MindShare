import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext,useState } from "react";
import MindshareSelectGames from "../../leftBar_Section/gaming/gaming";
import {Link} from "react-router-dom"

const LeftBar = () => {
  const [currentComponent, setCurrentComponent] = useState("home"); 
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">


      <div className="menu">
          <span>Your shortcuts</span>
          <div className="user">
            <img
              src={currentUser.profilepic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          <Link to='/chat'>
          <div className="item">
            <img src={Events} alt="" />
            <span>Chat</span>
          </div>
          </Link>
          <Link to='/news'>
          <div className="item">
            <img src={Events} alt="" />
            <span>News</span>
          </div>
          </Link>
          <Link to='/events'>
          <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div>
          </Link>
            <Link to='/gaming'>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          </Link>
          <Link to='/Memories'>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div>
          </Link>
            <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
        </div>

        <hr />
        <div className="menu">
          <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>
          <div className="item">
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
        </div>
        
       
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
