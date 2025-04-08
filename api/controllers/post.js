import {db} from "../connect.js"
import jwt from "jsonwebtoken";
import moment from "moment";
export const getPosts = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Corrected Query: Fetch own posts + followed users' posts
        const q = `
        SELECT p.*, u.id AS userId, u.name, u.profilepic 
FROM posts AS p
JOIN users AS u ON u.id = p.userId
LEFT JOIN relationships AS r ON p.userId = r.followedUserId 
WHERE p.userId = ? OR COALESCE(r.followerUserId, p.userId) = ?
ORDER BY p.createdAt DESC;
        `;

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) {
                console.error("Database Error:", err);  // Logs the error
                return res.status(500).json({ message: "Something went wrong!", error: err });
            }
            return res.status(200).json(data);
        });
    });
};
   


export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid");

        const q = "INSERT INTO posts (`description`, `image`, `createdAt`, `userId`) VALUES (?)";
        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
        ];

         db.query(q, [values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("post has been created");
         });
    });
};
