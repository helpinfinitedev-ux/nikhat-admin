"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, FileText, MessageSquare, ShoppingCart } from "lucide-react";

const navItems = [
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Blogs",
    href: "/blogs",
    icon: FileText,
  },
  {
    label: "Testimonials",
    href: "/testimonials",
    icon: MessageSquare,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pb-20 md:pb-0">
          <div className="p-4 md:p-8">{children}</div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-4 h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center text-xs font-medium transition-colors",
                    isActive
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
