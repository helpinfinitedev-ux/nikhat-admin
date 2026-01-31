import { IBlog } from "@/interfaces/blog";
import http from "./http.service";
import Promisable from "./promisable.service";

export const BlogService = {
  getBlogs: async () => {
    return await Promisable.asPromise(http.get("/api/blogs"));
  },
  createBlog: async (blog: Omit<IBlog, "_id" | "createdAt" | "updatedAt">) => {
    return await Promisable.asPromise(http.post("/api/blogs", blog));
  },
  updateBlog: async (id: string, blog: Omit<IBlog, "_id" | "createdAt" | "updatedAt">) => {
    return await Promisable.asPromise(http.patch(`/api/blogs/${id}`, blog));
  },
};
