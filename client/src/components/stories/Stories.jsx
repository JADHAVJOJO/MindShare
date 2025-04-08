import { useContext } from "react";
import "./stories.scss"
import { AuthContext } from "../../context/authContext"

const Stories = () => {

  const {currentUser} = useContext(AuthContext)

  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "Rohan Roy",
      img: "https://i.pinimg.com/474x/f4/b6/dd/f4b6dd84f76434cbe371639d1fdc1e20.jpg",
    },
    {
      id: 2,
      name: "Amit Bhai",
      img: "https://i.pinimg.com/474x/11/4f/46/114f46d86792146a68425224b1159193.jpg",
    },
    {
      id: 3,
      name: "Manisha Kdm",
      img: "https://i.pinimg.com/474x/1f/5b/c7/1f5bc788567c6c722c8d09f0b13a5eac.jpg",
    },
    {
      id: 4,
      name: "Nikhil Jdv",
      img: "https://i.pinimg.com/474x/27/17/d3/2717d35a23e9aef07b2a30c2da38df91.jpg",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
          <img src={"https://i.pinimg.com/474x/27/17/d3/2717d35a23e9aef07b2a30c2da38df91.jpg"} alt="This is my Story" />
          <span>{currentUser.name}</span>
          <button>+</button>
        </div>
      {stories.map(story=>(
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Stories