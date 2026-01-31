"use client";
import { IBlog } from "@/interfaces/blog";
import { BlogService } from "@/services/blog.service";
import { createContext, useEffect, useState } from "react";

type BlogsContextType = {
  blogs: IBlog[];
  setBlogs: (blogs: IBlog[]) => void;
  loading: boolean;
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  currentBlog: IBlog | null;
  setCurrentBlog: (blog: IBlog) => void;
  openCreateBlog: boolean;
  setOpenCreateBlog: (open: boolean) => void;
};

export const BlogsContext = createContext<BlogsContextType>({
  blogs: [] as IBlog[],
  setBlogs: (blogs: IBlog[]) => {},
  loading: false,
  trigger: false,
  setTrigger: (trigger: boolean) => {},
  currentBlog: null,
  setCurrentBlog: (blog: IBlog) => {},
  openCreateBlog: false,
  setOpenCreateBlog: (open: boolean) => {},
});

export const BlogsProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<IBlog | null>(null);
  const [openCreateBlog, setOpenCreateBlog] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const [response, error] = await BlogService.getBlogs();
      if (error) {
        console.error("Error fetching blogs:", error.message);
      } else {
        setBlogs(response?.data?.data || []);
      }
    };
    fetchBlogs();
  }, [trigger]);

  return <BlogsContext.Provider value={{ blogs, setBlogs, loading, trigger, setTrigger, currentBlog, setCurrentBlog, openCreateBlog, setOpenCreateBlog }}>{children}</BlogsContext.Provider>;
};
