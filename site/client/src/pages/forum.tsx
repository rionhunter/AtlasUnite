import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Plus } from "lucide-react";
import type { ForumPost } from "@shared/schema";

const newPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required").max(5000, "Content must be less than 5000 characters"),
  author: z.string().min(1, "Author name is required"),
  category: z.string().min(1, "Please select a category"),
});

type NewPostFormData = z.infer<typeof newPostSchema>;

const categories = [
  { value: "Project Coordination", label: "Project Coordination", color: "bg-blue-100 text-blue-800" },
  { value: "Ideas & Suggestions", label: "Ideas & Suggestions", color: "bg-green-100 text-green-800" },
  { value: "Success Stories", label: "Success Stories", color: "bg-yellow-100 text-yellow-800" }
];

export default function Forum() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  const { data: posts = [], isLoading } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum/posts"],
  });

  const form = useForm<NewPostFormData>({
    resolver: zodResolver(newPostSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      category: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: NewPostFormData) => {
      const response = await apiRequest("POST", "/api/forum/posts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setIsNewPostOpen(false);
      form.reset();
      toast({
        title: "Post Created!",
        description: "Your discussion has been posted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Post",
        description: error.message || "There was an error creating your post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewPostFormData) => {
    createPostMutation.mutate(data);
  };

  const formatTimeAgo = (date: Date | undefined) => {
    if (!date) return "";
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const getCategoryColor = (category: string) => {
    const categoryInfo = categories.find(cat => cat.value === category);
    return categoryInfo?.color || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="forum-title">
            Community Forum
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="forum-description">
            Connect with fellow volunteers, share ideas, ask questions, and coordinate projects. Our forum is where the Atlas Unite community comes together to plan and reflect.
          </p>
        </div>

        {/* Forum Stats & Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 mb-4 md:mb-0">
              <div className="text-center" data-testid="stat-posts">
                <div className="text-2xl font-bold text-primary">{posts.length}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="text-center" data-testid="stat-members">
                <div className="text-2xl font-bold text-primary">
                  {new Set(posts.map(post => post.author)).size}
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="text-center" data-testid="stat-today">
                <div className="text-2xl font-bold text-primary">
                  {posts.filter(post => {
                    const today = new Date();
                    const postDate = new Date(post.createdAt!);
                    return postDate.toDateString() === today.toDateString();
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Posts Today</div>
              </div>
            </div>
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-discussion">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Discussion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Start New Discussion</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="new-post-form">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-author" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={6} 
                              {...field}
                              data-testid="textarea-content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsNewPostOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createPostMutation.isPending}
                        data-testid="button-post"
                      >
                        {createPostMutation.isPending ? "Posting..." : "Post Discussion"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Forum Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {categories.map((category, index) => (
            <div 
              key={category.value}
              className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-primary"
              data-testid={`category-${index}`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.label}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {category.value === "Project Coordination" && "Organize upcoming projects, share resources, and coordinate volunteer efforts."}
                {category.value === "Ideas & Suggestions" && "Share new project ideas, suggest improvements, and brainstorm solutions."}
                {category.value === "Success Stories" && "Celebrate achievements, share photos, and inspire the community."}
              </p>
              <div className="text-sm text-gray-500">
                {posts.filter(post => post.category === category.value).length} posts • {
                  new Set(posts.filter(post => post.category === category.value).map(post => post.author)).size
                } members
              </div>
            </div>
          ))}
        </div>

        {/* Recent Discussions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900" data-testid="recent-discussions-title">
              Recent Discussions
            </h2>
          </div>
          
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="no-posts-title">
                No discussions yet
              </h3>
              <p className="text-gray-600 mb-6" data-testid="no-posts-description">
                Be the first to start a conversation in our community forum!
              </p>
              <Button onClick={() => setIsNewPostOpen(true)} data-testid="button-start-first">
                Start the First Discussion
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <div 
                key={post.id} 
                className="forum-post p-6"
                data-testid={`post-${post.id}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium text-sm">
                        {post.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-primary cursor-pointer">
                        {post.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Forum Guidelines */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6" data-testid="forum-guidelines">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Community Guidelines</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Keep discussions respectful and constructive</li>
            <li>• Stay on topic and relevant to Atlas Unite projects</li>
            <li>• Use clear, descriptive titles for new posts</li>
            <li>• Search existing discussions before posting</li>
            <li>• Share resources and help fellow volunteers</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
