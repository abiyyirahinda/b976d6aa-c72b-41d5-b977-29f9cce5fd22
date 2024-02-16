import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import React from "react";

const SearchBar = () => {
  return (
    <div className="flex px-20 items-center justify-center space-x-2">
      <Input  placeholder="Search Posts" />
      <Button type="submit">Search</Button>
    </div>
  );
};

export default SearchBar;
