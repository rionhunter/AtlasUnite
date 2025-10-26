import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Users, Clock } from "lucide-react";

const volunteerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  suburb: z.string().optional(),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  availability: z.array(z.string()).min(1, "Please select at least one availability option"),
  experience: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "You must consent to continue"),
  newsletter: z.boolean().optional(),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const interestOptions = [
  { value: "habitat-restoration", label: "Habitat Restoration" },
  { value: "creek-cleanups", label: "Creek Clean-ups" },
  { value: "community-gardens", label: "Community Gardens" },
  { value: "wildlife-conservation", label: "Wildlife Conservation" },
  { value: "charity-support", label: "Charity Support" },
  { value: "urban-biodiversity", label: "Urban Biodiversity" },
];

const availabilityOptions = [
  { value: "weekday-mornings", label: "Weekday Mornings" },
  { value: "weekday-afternoons", label: "Weekday Afternoons" },
  { value: "weekday-evenings", label: "Weekday Evenings" },
  { value: "saturday-mornings", label: "Saturday Mornings" },
  { value: "saturday-afternoons", label: "Saturday Afternoons" },
  { value: "sundays", label: "Sundays" },
];

export default function Volunteer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      suburb: "",
      interests: [],
      availability: [],
      experience: "",
      emergencyName: "",
      emergencyPhone: "",
      consent: false,
      newsletter: false,
    },
  });

  const createVolunteerMutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      const response = await apiRequest("POST", "/api/volunteers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/volunteers"] });
      setIsSubmitted(true);
      toast({
        title: "Registration Successful!",
        description: "Welcome to Atlas Unite! You'll receive a welcome email shortly.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VolunteerFormData) => {
    createVolunteerMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-900 mb-4" data-testid="success-title">
              Thank you for joining Atlas Unite!
            </h1>
            <p className="text-lg text-green-700 mb-6" data-testid="success-message">
              Your volunteer registration has been submitted successfully. You'll receive a welcome email with next steps and information about upcoming projects that match your interests.
            </p>
            <Button onClick={() => setIsSubmitted(false)} data-testid="button-register-another">
              Register Another Volunteer
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="volunteer-title">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="volunteer-description">
            Ready to make a difference? Sign up to volunteer with Atlas Unite and connect with like-minded people working toward positive change in Brisbane.
          </p>
        </div>

        {/* Volunteer Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-gray-50 rounded-lg" data-testid="benefit-impact">
            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Make Real Impact</h3>
            <p className="text-gray-600 text-sm">Contribute to projects that create lasting positive change in your community and environment.</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg" data-testid="benefit-connect">
            <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect & Learn</h3>
            <p className="text-gray-600 text-sm">Meet passionate people, learn new skills, and build meaningful relationships in your community.</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg" data-testid="benefit-flexible">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Flexible Commitment</h3>
            <p className="text-gray-600 text-sm">Choose projects and schedules that work for you. Volunteer when and how it fits your life.</p>
          </div>
        </div>

        {/* Volunteer Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="form-title">
            Volunteer Registration
          </h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="volunteer-form">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <FormField
                control={form.control}
                name="suburb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suburb/Area in Brisbane</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., South Brisbane, Paddington, New Farm" {...field} data-testid="input-suburb" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interests */}
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <FormLabel>Areas of Interest (Select all that apply)</FormLabel>
                    <div className="grid md:grid-cols-2 gap-3" data-testid="interests-group">
                      {interestOptions.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="interests"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), option.value]
                                      : (field.value || []).filter((value) => value !== option.value);
                                    field.onChange(updatedValue);
                                  }}
                                  data-testid={`checkbox-interest-${option.value}`}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Availability */}
              <FormField
                control={form.control}
                name="availability"
                render={() => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <div className="grid md:grid-cols-3 gap-3" data-testid="availability-group">
                      {availabilityOptions.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), option.value]
                                      : (field.value || []).filter((value) => value !== option.value);
                                    field.onChange(updatedValue);
                                  }}
                                  data-testid={`checkbox-availability-${option.value}`}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience & Skills */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevant Experience or Skills (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3}
                        placeholder="Tell us about any relevant experience, skills, or why you're interested in volunteering with Atlas Unite..."
                        {...field}
                        data-testid="textarea-experience"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emergency Contact */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="emergencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-emergency-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} data-testid="input-emergency-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Consent */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-consent"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        I consent to Atlas Unite contacting me about volunteer opportunities and keeping my information on file for volunteer coordination purposes. *
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-newsletter"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        I would like to receive occasional updates about Atlas Unite projects and events.
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={createVolunteerMutation.isPending}
                  data-testid="button-submit"
                >
                  {createVolunteerMutation.isPending ? "Submitting..." : "Join Atlas Unite"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-gradient-to-r from-secondary to-emerald-700 text-white rounded-lg p-8" data-testid="next-steps">
          <h3 className="text-2xl font-bold mb-4">What Happens Next?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Welcome Email</h4>
              <p className="text-sm opacity-90">You'll receive a welcome email with more information about our projects and community.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Project Matching</h4>
              <p className="text-sm opacity-90">We'll match you with projects that align with your interests and availability.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Get Involved</h4>
              <p className="text-sm opacity-90">Join your first project and start making a positive impact in Brisbane!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
