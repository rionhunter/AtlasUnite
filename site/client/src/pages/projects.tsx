import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Clock, Award, Search, Filter, Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Project {
  id: number;
  title: string;
  description: string;
  division: string;
  location: string;
  coordinator: string;
  status: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  xpReward: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

const divisionCategories = [
  { value: "all", label: "All Divisions" },
  { value: "locals_unite", label: "Locals Unite" },
  { value: "habitat_restoration", label: "Habitat Restoration" },
  { value: "community_garden", label: "Community Gardens" },
  { value: "atlas_ink", label: "Atlas Ink" },
  { value: "education", label: "Education & Workshops" },
  { value: "charity_support", label: "Charity Support" }
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "planning", label: "Planning" },
  { value: "recruiting", label: "Recruiting" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" }
];

const locationOptions = [
  { value: "all", label: "All Locations" },
  { value: "brisbane-city", label: "Brisbane City" },
  { value: "north-brisbane", label: "North Brisbane" },
  { value: "south-brisbane", label: "South Brisbane" },
  { value: "east-brisbane", label: "East Brisbane" },
  { value: "west-brisbane", label: "West Brisbane" },
  { value: "ipswich", label: "Ipswich" },
  { value: "logan", label: "Logan" },
  { value: "redland", label: "Redland" },
  { value: "moreton-bay", label: "Moreton Bay" },
  { value: "gold-coast", label: "Gold Coast" },
  { value: "sunshine-coast", label: "Sunshine Coast" },
  { value: "toowoomba", label: "Toowoomba" },
  { value: "remote", label: "Remote/Online" }
];

const getDivisionColor = (division: string) => {
  const colors: Record<string, string> = {
    locals_unite: "bg-blue-100 text-blue-800",
    habitat_restoration: "bg-green-100 text-green-800",
    community_garden: "bg-emerald-100 text-emerald-800",
    atlas_ink: "bg-purple-100 text-purple-800",
    education: "bg-yellow-100 text-yellow-800",
    charity_support: "bg-red-100 text-red-800",
  };
  return colors[division] || "bg-gray-100 text-gray-800";
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    planning: "bg-gray-100 text-gray-800",
    recruiting: "bg-orange-100 text-orange-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    paused: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function Projects() {
  const { toast } = useToast();
  const [activeDivision, setActiveDivision] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeLocation, setActiveLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects with better caching
  const { data: projects = [], isLoading: projectsLoading, error } = useQuery({
    queryKey: ["/api/projects"],
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project: Project) => {
      const matchesDivision = activeDivision === "all" || project.division === activeDivision;
      const matchesStatus = activeStatus === "all" || project.status === activeStatus;
      const matchesLocation = activeLocation === "all" || 
        project.location?.toLowerCase().includes(activeLocation.replace("-", " ")) ||
        (activeLocation === "remote" && (!project.location || project.location.toLowerCase().includes("remote") || project.location.toLowerCase().includes("online")));
      const matchesSearch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.coordinator?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDivision && matchesStatus && matchesLocation && matchesSearch;
    });
  }, [projects, activeDivision, activeStatus, activeLocation, searchQuery]);

  // Join project mutation with error handling
  const joinProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      // This would create a time commitment for the project
      const response = await fetch("/api/time-commitments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          hoursPledged: 4, // Default commitment
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully joined project!",
        description: "You've committed to this project. Check your dashboard for updates.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to join project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (projectsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Find meaningful ways to make an impact</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-projects-title">Projects</h1>
          <p className="text-gray-600">Find meaningful ways to make an impact in your community</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" data-testid="button-create-project">
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-projects"
          />
        </div>
        
        <Select value={activeDivision} onValueChange={setActiveDivision}>
          <SelectTrigger data-testid="select-division-filter">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Division" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {divisionCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={activeLocation} onValueChange={setActiveLocation}>
          <SelectTrigger data-testid="select-location-filter">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locationOptions.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={() => {
            setActiveDivision("all");
            setActiveStatus("all");
            setActiveLocation("all");
            setSearchQuery("");
          }}
          data-testid="button-clear-filters"
        >
          Clear Filters
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project: Project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow" data-testid={`project-card-${project.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getDivisionColor(project.division)}>
                    {divisionCategories.find(d => d.value === project.division)?.label || project.division}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg" data-testid={`text-project-title-${project.id}`}>
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center" data-testid={`text-project-location-${project.id}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{project.location || 'Various Locations'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{project.volunteersRegistered || 0}/{project.volunteersNeeded || 'Unlimited'} volunteers</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    <span>{project.xpReward || 10} XP points</span>
                  </div>

                  {project.startDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Starts {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {project.coordinator && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Coordinator: {project.coordinator}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => joinProjectMutation.mutate(project.id)}
                  disabled={joinProjectMutation.isPending || project.status === 'completed'}
                  data-testid={`button-join-project-${project.id}`}
                >
                  {joinProjectMutation.isPending ? (
                    "Joining..."
                  ) : project.status === 'completed' ? (
                    "Completed"
                  ) : (
                    "Join Project"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || activeDivision !== "all" || activeStatus !== "all" || activeLocation !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "No projects are available right now. Check back later or create a new project."}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveDivision("all");
                  setActiveStatus("all");
                  setActiveLocation("all");
                  setSearchQuery("");
                }}
                data-testid="button-reset-filters"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {filteredProjects.length > 0 && (
        <div className="mt-12 text-center text-gray-600">
          <p>
            Showing {filteredProjects.length} of {projects.length} projects
            {activeDivision !== "all" && ` in ${divisionCategories.find(d => d.value === activeDivision)?.label}`}
            {activeLocation !== "all" && ` in ${locationOptions.find(l => l.value === activeLocation)?.label}`}
          </p>
        </div>
      )}
    </div>
  );
}