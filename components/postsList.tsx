"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import {ZodError, z} from "Zod"

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  tags: z.array(z.string()),
  reactions: z.number(),
});

const AllSchema = z.object({
  posts: z.array(PostSchema),
});

type Post = z.infer<typeof PostSchema>;
type All = z.infer<typeof AllSchema>;
const PostList = () => {
  const [list, setList] = useState<All | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getPosts = async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `https://dummyjson.com/posts/search?q=${query}`
        : "https://dummyjson.com/posts";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      AllSchema.parse(res);
      setList(res);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("API response validation error:", error.errors);
      } else {
        console.error("API request error:", error);
      }

    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query === "") {
      getPosts();
    }
  };
  
  // Fungsi untuk menangani submit pencarian
  const handleSearchSubmit = () => {
    if (searchQuery) { // Hanya melakukan pencarian jika ada query
      getPosts(searchQuery);
    } else {
      getPosts();
    }
  };


  useEffect(() => {
    getPosts();
  }, []);

  const placeholderArray = Array.from({ length: 10 });
  const router = useRouter();

  return (
    <Card className="px-72 space-y-5">
      <div className="flex py-12 items-center justify-center space-x-2">
        <Input placeholder="Search Posts" value={searchQuery} onChange={handleSearchChange}/>
        <Button type="submit" onClick={handleSearchSubmit}>Search</Button>
      </div>
      {loading
        ? placeholderArray.map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6 h-32 space-y-2">
                <Skeleton className="h-4 w-[400px] bg-gray-500" />
                <Skeleton className="h-4 w-full bg-gray-500" />
                <Skeleton className="h-4 w-full bg-gray-500" />
              </CardContent>
            </Card>
          ))
        : list?.posts.map((post: Post) => (
            <div onClick={() => router.push(`posts/${post.id}`)} key={post.id}>
              <Card>
                <CardContent
                  onClick={() =>
                    localStorage.setItem("selectedPostId", `${post.id}`)
                  }
                  className="p-6 cursor-pointer"
                >
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription className="font-semibold">
                    {post.body}
                  </CardDescription>
                  <div className="space-x-2 pt-2">
                    {post.tags.map((tag,index) => (
                      <Button key={`${tag}-${index}`}>{tag}</Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
    </Card>
  );
};

export default PostList;
