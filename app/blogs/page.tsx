"use client";

import AdminLayout from "@/components/admin-layout";
import RichTextEditor from "@/components/rich-text-editor";

export default function BlogsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500 mt-1">Create and manage blog posts</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Blog Editor
          </h2>
          <RichTextEditor />
        </div>
      </div>
    </AdminLayout>
  );
}
