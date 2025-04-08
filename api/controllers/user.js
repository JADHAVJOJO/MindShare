import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";
  
    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (data.length === 0) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      // Ensure user exists before destructuring
      const { password, ...info } = data[0];
      return res.json(info);
    });
  };
  

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilepic`=?,`coverpic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverpic,
        req.body.profilepic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};