import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Blog Admin</h1>
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/admin">New Post</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/admin/posts">Manage Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  )
}