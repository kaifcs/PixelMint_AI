import { Zap, Target, Users, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              About <span className="gradient-text">PixelMint AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're building the fastest, most accurate AI-powered background removal tool on the planet.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {[
              { icon: Target, title: "Our Mission", desc: "To democratize professional image editing by making background removal instant, accessible, and affordable for everyone." },
              { icon: Zap, title: "Our Technology", desc: "Cutting-edge neural networks trained on millions of images deliver precise edge detection and natural-looking results." },
              { icon: Users, title: "Our Users", desc: "Trusted by e-commerce sellers, designers, content creators, and students across 50+ countries worldwide." },
              { icon: Globe, title: "Our Scale", desc: "Processing thousands of images monthly with reliable uptime, powered by robust cloud infrastructure." },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-8">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
