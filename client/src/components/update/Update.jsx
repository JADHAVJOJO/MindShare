import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email || "",
    password: user.password || "",
    name: user.name || "",
    city: user.city || "",
    website: user.website || "",
  });

  // Function to upload images
  const upload = async (file) => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data; // Returns image URL
    } catch (err) {
      console.log("Upload Error:", err);
      return null;
    }
  };

  // Handles text input changes
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  // Mutation for updating user data
  const mutation = useMutation({
    mutationFn: async (updatedUser) => makeRequest.put("/users", updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      setOpenUpdate(false);
    },
  });

  // Handle update button click
  const handleClick = async (e) => {
    e.preventDefault();

    // Upload images first if changed
    let coverUrl = user.coverPic;
    let profileUrl = user.profilePic;

    if (cover) coverUrl = await upload(cover);
    if (profile) profileUrl = await upload(profile);

    // Construct update object only with changed values
    const updatedUser = {
      email: texts.email.trim() !== "" ? texts.email : user.email,
      password: texts.password.trim() !== "" ? texts.password : user.password,
      name: texts.name.trim() !== "" ? texts.name : user.name,
      city: texts.city.trim() !== "" ? texts.city : user.city,
      website: texts.website.trim() !== "" ? texts.website : user.website,
      coverPic: coverUrl,
      profilePic: profileUrl,
    };

    console.log("Updating User Data:", updatedUser); // Debugging

    mutation.mutate(updatedUser);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            {/* Cover Image Upload */}
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img src={cover ? URL.createObjectURL(cover) : user.coverPic} alt="Cover" />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input type="file" id="cover" style={{ display: "none" }} onChange={(e) => setCover(e.target.files[0])} />

            {/* Profile Image Upload */}
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img src={profile ? URL.createObjectURL(profile) : user.profilePic} alt="Profile" />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input type="file" id="profile" style={{ display: "none" }} onChange={(e) => setProfile(e.target.files[0])} />
          </div>

          {/* Input Fields */}
          <label>Email</label>
          <input type="email" name="email" value={texts.email} onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" value={texts.password} onChange={handleChange} />

          <label>Name</label>
          <input type="text" name="name" value={texts.name} onChange={handleChange} />

          <label>City</label>
          <input type="text" name="city" value={texts.city} onChange={handleChange} />

          <label>Website</label>
          <input type="text" name="website" value={texts.website} onChange={handleChange} />

          <button onClick={handleClick}>Update</button>
        </form>

        <button className="close" onClick={() => setOpenUpdate(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;
