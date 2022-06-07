import type { NextApiRequest, NextApiResponse } from "next";

const User = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  //   const user = req.session.get("user");
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    authLevel: "admin",
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  };

  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    return res.json({
      isLoggedIn: true,
      ...user,
    });
  } else {
    return res.json({
      isLoggedIn: false,
    });
  }
};

export default User;
