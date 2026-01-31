"use client";

import AdminLayout from "@/components/admin-layout";
import BlogsList from "@/app/blogs/_components/blogs-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogsContext } from "@/context/blogs";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { BlogService } from "@/services/blog.service";
import { toast } from "sonner";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
});

export default function BlogsPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const { blogs, loading, trigger, setTrigger, openCreateBlog, setOpenCreateBlog, currentBlog } = useContext(BlogsContext);
  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(currentBlog);
  const handleSubmit = async () => {
    let response: any;
    let error: any;
    if (currentBlog) {
      [response, error] = await BlogService.updateBlog(currentBlog._id, { title, content: content as string });
    } else {
      [response, error] = await BlogService.createBlog({ title, content: content as string, excerpt: "" });
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Blog created successfully");
      setTrigger(!trigger);
    }
    setOpenCreateBlog(false);
    setTitle("");
    setContent("");
  };
  useEffect(() => {
    setTitle(currentBlog?.title || "");
    setContent(currentBlog?.content || "");
  }, [currentBlog]);
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
            <p className="text-gray-500 mt-1">Create and manage blog posts</p>
          </div>
          <Button className="cursor-pointer mt-4 w-full" onClick={() => setOpenCreateBlog(true)}>
            Add Blog
          </Button>
        </div>
        {!openCreateBlog && <BlogsList />}
        {openCreateBlog && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Title</h2>
            <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <div className="bg-white rounded-lg border border-gray-200 p-6 h-[70vh] overflow-scroll">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Editor</h2>
              <RichTextEditor onChange={setContent} editable={true} initialContent={currentBlog?.content || ""} />
            </div>
            <Button className="cursor-pointer mt-4 w-full" onClick={handleSubmit}>
              Save
            </Button>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
