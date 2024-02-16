import Navbar from "@/components/navbar";
import React from "react";
import SinglePost from "./components/singlePost";

const PostDetail = () => {
  return (
    <div className="space-y-0 pb-10">
      <Navbar />
      <SinglePost />
    </div>
  );
};

export default PostDetail;
