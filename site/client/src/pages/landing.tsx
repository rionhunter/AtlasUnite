import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, TreePine, Heart, Target, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TreePine className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">Atlas Unite</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/api/login" data-testid="button-login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Unite for Environmental Impact
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join Brisbane's premier community of environmental volunteers. Earn XP points, 
            climb division levels, and make a real difference through verified time commitments 
            and impactful projects.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
              <a href="/api/login" data-testid="button-get-started">Get Started</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#about" data-testid="button-learn-more">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Atlas Unite</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building Brisbane's most engaged environmental community through 
              gamification, verified impact tracking, and meaningful collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Gamified Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn XP points for every action. Progress through division levels. 
                  Build your reliability score and become a division champion.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Time Trust Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Make verified time commitments to projects. Track your impact 
                  and build trust within the community through accountability.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Community Forums</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with like-minded volunteers. Share experiences, 
                  coordinate projects, and build lasting environmental partnerships.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission Statement */}
          <div className="bg-green-50 rounded-lg p-8 text-center">
            <Heart className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Atlas Unite connects passionate volunteers with environmental conservation 
              and social impact initiatives across Brisbane. We believe in the power of 
              community action, verified impact, and gamified engagement to create 
              lasting positive change in our environment and society.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600">
              Everything you need to make a meaningful environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Verified Impact</h4>
              <p className="text-sm text-gray-600">
                All volunteer hours and project completions are verified by division champions
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Award className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">XP & Levels</h4>
              <p className="text-sm text-gray-600">
                Earn experience points and climb through division levels as you contribute
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Users className="h-10 w-10 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Community Forums</h4>
              <p className="text-sm text-gray-600">
                Connect with volunteers, share ideas, and coordinate environmental projects
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Target className="h-10 w-10 text-orange-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Time Contracts</h4>
              <p className="text-sm text-gray-600">
                Commit time to projects and build your reliability score through completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join our community of environmental volunteers and start earning XP 
            for your contributions to Brisbane's sustainability future.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/api/login" data-testid="button-join-now">Join Atlas Unite</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TreePine className="h-6 w-6" />
                <span className="text-lg font-bold">Atlas Unite</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting Brisbane volunteers with environmental impact opportunities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Projects</a></li>
                <li><a href="#" className="hover:text-white">Forums</a></li>
                <li><a href="#" className="hover:text-white">Leaderboard</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Volunteer Guide</a></li>
                <li><a href="#" className="hover:text-white">Champions</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Atlas Unite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}