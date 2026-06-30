import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "../_components/Footer";

export default function ContactUs() {
  return (
    <>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-2">
            Contact Us
          </h2>
          <p className="text-xl text-muted-foreground">
            Get in touch for any query
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="text-2xl font-semibold tracking-tight">
                Get In Touch
              </h3>
              <p className="text-muted-foreground">
                The contact form is currently inactive. Get a functional and
                working contact form with Ajax & PHP in a few minutes. Just copy
                and paste the files, add a little code, and you&apos;re done.{" "}
                <a
                  href="https://htmlcodex.com/contact-form"
                  className="text-primary hover:underline"
                >
                  Download Now
                </a>
                .
              </p>

              {[
                {
                  icon: MapPin,
                  title: "Office",
                  content: "123 Street, Faisalabad, Pakistan",
                },
                { icon: Phone, title: "Mobile", content: "03265403373" },
                {
                  icon: Mail,
                  title: "Email",
                  content: "sundasreman67.89@gmail.com",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-10 h-10">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Google Map */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <iframe
                className="w-full h-[400px] rounded-lg"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                frameBorder="0"
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              />
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Name
                    </label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Your Email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subject
                  </label>
                  <Input id="subject" placeholder="Subject" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Leave a message here"
                    className="min-h-[100px]"
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
