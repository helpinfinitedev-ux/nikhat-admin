"use client";

import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";

const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
});

export default function BlogsPage() {
  const [content, setContent] = useState("");
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500 mt-1">Create and manage blog posts</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 h-[70vh]">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Editor</h2>
          <RichTextEditor onChange={setContent} editable={true} initialContent={content} />
        </div>
        <Button className="cursor-pointer mt-4 w-full" onClick={() => {}}>
          Save
        </Button>
      </div>
    </AdminLayout>
  );
}
