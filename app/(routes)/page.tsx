import Navbar from "@/components/navbar";
import PostList from "@/components/postsList";
import SearchBar from "@/components/searchBar";

export default function Home() {
  return (
    <div className="space-y-0 pb-10">
      <Navbar />
      <PostList />
    </div>
  );
}
