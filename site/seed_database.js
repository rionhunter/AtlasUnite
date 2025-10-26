// Simple seed script to add sample data to the database
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './shared/schema.js';

const neonConfig = { webSocketConstructor: ws };

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

const sampleProjects = [
  {
    title: "Creek Cleanup at Kedron Brook",
    description: "Join us for a community creek cleanup at Kedron Brook. We'll be removing litter, invasive plants, and helping restore the natural habitat for local wildlife.",
    division: "habitat_restoration",
    location: "Kedron Brook, North Brisbane",
    coordinator: "Sarah Johnson",
    status: "recruiting",
    volunteersNeeded: 15,
    volunteersRegistered: 8,
    xpReward: 25,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
  },
  {
    title: "Community Garden Setup - Paddington",
    description: "Help establish a new community garden in Paddington! We need volunteers to help with soil preparation, planting, and setting up irrigation systems.",
    division: "community_garden",
    location: "Paddington Community Center",
    coordinator: "Mike Chen",
    status: "active",
    volunteersNeeded: 12,
    volunteersRegistered: 12,
    xpReward: 30,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: "Food Drive Coordination",
    description: "Organize and coordinate a food drive for local families in need. Tasks include collection point setup, sorting donations, and distribution coordination.",
    division: "charity_support",
    location: "Various Locations - Brisbane",
    coordinator: "Emma Davis",
    status: "planning",
    volunteersNeeded: 20,
    volunteersRegistered: 5,
    xpReward: 20,
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
  },
  {
    title: "Environmental Education Workshop",
    description: "Help deliver environmental education workshops to local schools. Share knowledge about sustainability, recycling, and conservation with the next generation.",
    division: "education",
    location: "Various Schools - Brisbane",
    coordinator: "Dr. Alex Thompson",
    status: "recruiting",
    volunteersNeeded: 8,
    volunteersRegistered: 3,
    xpReward: 35,
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
  },
  {
    title: "Newsletter Content Creation",
    description: "Help create engaging content for our monthly environmental newsletter. Writers, photographers, and editors welcome!",
    division: "atlas_ink",
    location: "Remote/Online",
    coordinator: "Lisa Rodriguez",
    status: "active",
    volunteersNeeded: 6,
    volunteersRegistered: 4,
    xpReward: 15,
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
  },
  {
    title: "Local Business Sustainability Outreach",
    description: "Connect with local businesses to promote sustainable practices and environmental consciousness in the business community.",
    division: "locals_unite",
    location: "Brisbane CBD",
    coordinator: "James Wilson",
    status: "recruiting",
    volunteersNeeded: 10,
    volunteersRegistered: 7,
    xpReward: 22,
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  }
];

const sampleForumPosts = [
  {
    title: "Creek Cleanup Success - Thank You Volunteers!",
    content: "What an amazing turnout at yesterday's Kedron Brook cleanup! We removed over 200kg of litter and planted 50 native plants. Special thanks to all 18 volunteers who showed up despite the early morning start. The local wildlife will definitely benefit from our efforts!",
    category: "Project Updates",
    userId: null, // Will be updated when we have users
  },
  {
    title: "Best Native Plants for Brisbane Gardens?",
    content: "I'm starting a small native garden in my backyard and wondering what plants work best in Brisbane's climate. Looking for low-maintenance options that attract local birds and butterflies. Any suggestions from experienced gardeners?",
    category: "Gardening & Plants",
    userId: null,
  },
  {
    title: "New Division Champion Applications Open",
    content: "We're looking for passionate volunteers to become Division Champions in Habitat Restoration and Community Gardens. Champions help verify project completions and mentor new volunteers. Applications close next Friday!",
    category: "Announcements",
    userId: null,
  },
  {
    title: "Carpooling to Environmental Expo",
    content: "Anyone interested in carpooling to the Brisbane Environmental Expo next weekend? I have space for 3 people in my car, leaving from the city at 9am. Great opportunity to see the latest in sustainability innovations!",
    category: "Events & Meetups",
    userId: null,
  },
  {
    title: "XP Point System Explanation",
    content: "For newer members, here's how our XP system works: You earn points for completed projects, verified time commitments, and community contributions. Points help you progress through division levels and become eligible for leadership roles. It's all about recognizing your environmental impact!",
    category: "Community Help",
    userId: null,
  }
];

async function seedDatabase() {
  try {
    console.log('Seeding projects...');
    for (const project of sampleProjects) {
      await db.insert(schema.projects).values(project);
    }
    
    console.log('Seeding forum posts...');
    for (const post of sampleForumPosts) {
      await db.insert(schema.forumPosts).values(post);
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();