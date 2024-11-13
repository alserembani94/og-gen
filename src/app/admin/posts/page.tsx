'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Post = {
  id: string;
  title: string;
  description: string;
  ogImageUrl: string;
  createdAt: string;
};

type EditModalProps = {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, title: string, description: string) => Promise<void>;
};



function DeleteAlert({ postId, postTitle, onDelete }: { 
  postId: string; 
  postTitle: string;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(postId);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{postTitle}&quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditModal({ post, isOpen, onClose, onSave }: EditModalProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    setLoading(true);
    try {
      await onSave(post.id, title, description);
      onClose();
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Post description"
              required
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (id: string, title: string, description: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      await fetchPosts();
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
      throw error;
    }
  };

  const handleDeletePost = async (id: string) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    await fetchPosts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Posts</h1>
        <Button onClick={() => window.location.href = '/admin'}>
          Create New Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600">{post.description}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedPost(post)}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
                <DeleteAlert 
                  postId={post.id}
                  postTitle={post.title}
                  onDelete={handleDeletePost}
                />
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No posts found. Create your first post!
          </div>
        )}
      </div>

      <EditModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onSave={handleUpdatePost}
      />
    </div>
  );
}