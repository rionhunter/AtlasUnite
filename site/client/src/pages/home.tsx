import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, TreePine, Award, Target, TrendingUp, Heart, Shield, LogOut, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: forumPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["/api/forum/posts"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-welcome">
            Welcome back, {user?.firstName || 'Volunteer'}!
          </h1>
          <p className="text-gray-600">Ready to make an impact today?</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/api/logout" data-testid="button-logout">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </a>
        </Button>
      </div>

      {/* About Atlas Unite Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg mb-12">
        <div className="text-center">
          <TreePine className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Atlas Unite</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            We're building Brisbane's most engaged environmental community through 
            gamification, verified impact tracking, and meaningful collaboration. 
            Earn XP points, climb division levels, and make a real difference through 
            verified time commitments.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <Award className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Gamified Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Earn XP points, progress through levels, and become a division champion
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Time Trust Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Make verified time commitments and build community trust
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-10 w-10 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Verified Impact</CardTitle>
      </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  All contributions are verified by division champions
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-6">
            <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Atlas Unite connects passionate volunteers with environmental conservation 
              and social impact initiatives across Brisbane. We believe in the power of 
              community action, verified impact, and gamified engagement to create 
              lasting positive change.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Button asChild className="h-24 text-lg bg-green-600 hover:bg-green-700">
          <Link href="/volunteer" data-testid="button-become-volunteer">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div>Become a Volunteer</div>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 text-lg">
          <Link href="/projects" data-testid="button-browse-projects">
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2" />
              <div>Browse Projects</div>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 text-lg">
          <Link href="/forum" data-testid="button-join-discussions">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2" />
              <div>Join Discussions</div>
            </div>
          </Link>
        </Button>
      </div>

      {/* Dashboard Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Recent Projects
            </CardTitle>
            <CardDescription>Latest opportunities to make an impact</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 3).map((project: any) => (
                  <div key={project.id} className="border-l-4 border-green-500 pl-4" data-testid={`project-${project.id}`}>
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{project.location || 'Various Locations'}</span>
                      <Badge variant="secondary" className="ml-2">
                        {project.division}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/projects" data-testid="button-view-all-projects">View All Projects</Link>
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No projects available yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Forum Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Community Discussions
            </CardTitle>
            <CardDescription>Latest conversations from the community</CardDescription>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : forumPosts.length > 0 ? (
              <div className="space-y-4">
                {forumPosts.slice(0, 3).map((post: any) => (
                  <div key={post.id} className="border-l-4 border-blue-500 pl-4" data-testid={`post-${post.id}`}>
                    <h4 className="font-semibold text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <Badge variant="outline" className="ml-2">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/forum" data-testid="button-view-all-posts">View All Discussions</Link>
                </Button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No discussions yet - be the first to start one!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-600">Active Volunteers</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            <p className="text-sm text-gray-600">Active Projects</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">248</div>
            <p className="text-sm text-gray-600">Hours Volunteered</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,350</div>
            <p className="text-sm text-gray-600">XP Points Earned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}