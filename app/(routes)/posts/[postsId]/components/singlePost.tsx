"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";
import { ZodError, z } from "Zod";

// interface PostList {
//   id: number;
//   title: string;
//   body: string;
//   tags: string[];
// }
// interface User {
//   id: number;
//   username: string;
// }

// interface Comment {
//   id: number;
//   body: string;
//   postId: number;
//   user: User;
// }

// interface CommentRes {
//   comments: Comment[];
// }

// interface userComment {
//   id: number;
//   body: string;
//   postId: number;
//   user: UserId;
// }
// interface UserId {
//   id: number;
//   username: string;
// }

const PostListSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
});

const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
});

const CommentSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  user: UserSchema,
});

const CommentResSchema = z.object({
  comments: z.array(CommentSchema),
});

const UserIdSchema = z.object({
  id: z.number(),
  username: z.string(),
});

const userCommentSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  user: UserIdSchema,
});

const SinglePost = () => {
  // const [list, setList] = useState<PostList | null>(null);
  // const [commentsData, setCommentsData] = useState<CommentRes | null>(null);

  // const [userCommentRes, setUserCommentRes] = useState<userComment | null>(
  //   null
  //   );
  const [list, setList] = useState<z.infer<typeof PostListSchema> | null>(null);
const [commentsData, setCommentsData] = useState<z.infer<typeof CommentResSchema> | null>(null);
const [userCommentRes, setUserCommentRes] = useState<z.infer<typeof userCommentSchema> | null>(null);

  const [userComment, setUserComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const postId = localStorage.getItem("selectedPostId");

  const getPosts = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      PostListSchema.parse(res); 
      setList(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const getComments = async () => {
    try {
      const response = await fetch(
        `https://dummyjson.com/comments/post/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      CommentResSchema.parse(res);
      setCommentsData(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
    getComments();
    loadCommentFromLocalStorage();
    // localStorage.removeItem('userCommentRes')
  }, []);
  const loadCommentFromLocalStorage = () => {
    const savedComment = localStorage.getItem(`userCommentRes_${postId}`);
    if (savedComment) {
      setUserCommentRes(JSON.parse(savedComment));
    }
  };
  const commentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserComment(event.target.value);
  };

  const submitComment = async () => {
    try {
      const response = await fetch("https://dummyjson.com/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: userComment,
          postId: postId,
          userId: 1,
        }),
      });
      const res = await response.json();
      userCommentSchema.parse(res);
      setUserCommentRes(res);
      localStorage.setItem(`userCommentRes_${postId}`, JSON.stringify(res));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loading ? (
        <Card className="px-[262px] py-20">
          <CardContent className=" h-36 space-y-2">
            <Skeleton className="h-4 w-[400px] bg-gray-500" />
            <Skeleton className="h-4 w-full bg-gray-500" />
            <Skeleton className="h-4 w-full bg-gray-500" />
          </CardContent>
        </Card>
      ) : (
        <Card className="px-[262px] py-20">
          <CardContent className="flex flex-col justify-center gap-4">
            <CardTitle>{list?.title}</CardTitle>
            <div className="space-x-2">
              {list?.tags.map((tag, index) => (
                <Button key={`${tag}-${index}`}>{tag}</Button>
              ))}
            </div>
            <CardDescription className="font-bold text-xl text-black">
              {list?.body}
            </CardDescription>
            <CardTitle>Comments</CardTitle>
            <div className="flex space-x-2">
              <Input
                onChange={commentChange}
                placeholder="Write a comment..."
              />
              <Button onClick={submitComment}>Send</Button>
            </div>
            {userCommentRes && userCommentRes.postId.toString() === postId && (
              <div>
                <p className="text-blue-500 font-semibold">
                  {userCommentRes.user.username}
                </p>
                <h1 className="font-normal border-b">{userCommentRes.body}</h1>
              </div>
            )}
            {commentsData?.comments.map((comment) => (
              <div key={comment.id}>
                <p className="text-blue-500 font-semibold">
                  {comment.user.username}
                </p>

                <h1 className=" font-normal border-b  ">{comment.body}</h1>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SinglePost;
