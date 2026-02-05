"use client";

import { BlogsContext } from "@/context/blogs";
import React, { useContext } from "react";
import { Button } from "../../../../components/ui/button";
import DateService from "@/utils/date";
import { FileText, Loader2 } from "lucide-react";
import { BlogService } from "@/services/blog.service";
import { toast } from "sonner";

const BlogsList = () => {
  const { blogs, loading, currentBlog, setCurrentBlog, setOpenCreateBlog, setBlogs } = useContext(BlogsContext);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    const [, error] = await BlogService.deleteBlog(id);
    if (error) {
      toast.error(error.message || "Failed to delete blog");
      return;
    }

    setBlogs(blogs.filter((blog) => blog._id !== id));
    if (currentBlog?._id === id) setOpenCreateBlog(false);
    toast.success("Blog deleted successfully");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
          <p className="text-gray-500">Loading blogs...</p>
        </div>
      </div>
    );
  }
  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">No blogs yet</h3>
            <p className="text-gray-500 max-w-md">Get started by adding your first blog using the button above</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{blog.title}</div>
                </td>
                <td className="px-6 py-4">
                  {blog.content ? (
                    <div className="prose prose-sm max-w-md text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.content }} />
                  ) : (
                    <p className="text-sm text-gray-400">No content</p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-900 whitespace-nowrap">{DateService.getDateInDDMonthNameYYYY(blog.createdAt.toString())}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentBlog(blog);
                        setOpenCreateBlog(true);
                      }}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(blog._id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogsList;
