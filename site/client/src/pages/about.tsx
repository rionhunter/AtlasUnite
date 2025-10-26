import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, BookOpen } from "lucide-react";

export default function About() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="about-title">
            About Atlas Unite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="about-description">
            A movement dedicated to connecting communities with environmental conservation and social impact initiatives across Australia.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid="story-title">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4" data-testid="story-paragraph-1">
              Atlas Unite was born from a simple belief: that communities have the power to create positive change when given the right tools, connections, and support. Founded in 2023, we started as a grassroots initiative in Brisbane, connecting passionate individuals with local environmental and social projects.
            </p>
            <p data-testid="story-paragraph-2">
              Today, we've grown into a movement that spans multiple divisions, each focused on different aspects of community building and positive impact. Our approach combines local action with broader knowledge sharing, creating a network of engaged citizens working toward a more sustainable and equitable future.
            </p>
          </div>
        </div>

        {/* Divisions */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Locals Unite */}
          <div className="bg-gray-50 rounded-lg p-8" data-testid="division-locals-unite">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Locals Unite</h3>
            </div>
            <p className="text-gray-600 mb-4" data-testid="locals-unite-description">
              Our on-the-ground action arm, currently focused on Brisbane and surrounding areas. Locals Unite organizes and coordinates community projects, from environmental restoration to social initiatives.
            </p>
            
            <h4 className="font-semibold text-gray-900 mb-2">Focus Areas:</h4>
            <ul className="text-gray-600 space-y-1 mb-6" data-testid="locals-unite-focus-areas">
              <li>• Habitat restoration and conservation</li>
              <li>• Creek and waterway clean-ups</li>
              <li>• Community garden development</li>
              <li>• Land for Wildlife partnerships</li>
              <li>• Local charity collaborations</li>
              <li>• Urban biodiversity projects</li>
            </ul>
            
            <Link href="/volunteer">
              <Button data-testid="button-join-brisbane">Join Brisbane Chapter</Button>
            </Link>
          </div>

          {/* Atlas Ink */}
          <div className="bg-gray-50 rounded-lg p-8" data-testid="division-atlas-ink">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Atlas Ink</h3>
            </div>
            <p className="text-gray-600 mb-4" data-testid="atlas-ink-description">
              Our digital publishing platform dedicated to sharing knowledge, best practices, and inspiring stories from the community action space. Atlas Ink amplifies voices and spreads ideas that drive positive change.
            </p>
            
            <h4 className="font-semibold text-gray-900 mb-2">Content Areas:</h4>
            <ul className="text-gray-600 space-y-1 mb-6" data-testid="atlas-ink-content-areas">
              <li>• Project guides and how-tos</li>
              <li>• Volunteer success stories</li>
              <li>• Environmental science updates</li>
              <li>• Community organizing tips</li>
              <li>• Policy analysis and advocacy</li>
              <li>• Partnership spotlights</li>
            </ul>
            
            <Button className="bg-secondary hover:bg-emerald-700" data-testid="button-read-stories">
              Read Our Stories
            </Button>
          </div>
        </div>

        {/* Future Expansion */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg p-12" data-testid="future-expansion">
          <h3 className="text-2xl font-bold mb-4">Expanding Our Reach</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            While we're currently focused on Brisbane, our vision extends across Australia. We're building the framework and tools that will allow communities everywhere to organize, act, and create positive change.
          </p>
          <p className="text-base opacity-90">
            Interested in bringing Atlas Unite to your city? Get in touch to learn about our expansion plans.
          </p>
        </div>
      </div>
    </section>
  );
}
