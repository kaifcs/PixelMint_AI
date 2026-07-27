const Terms = () => (
  <div className="min-h-screen bg-background">
    <div className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 prose prose-invert prose-sm">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: April 13, 2026</p>
        
        {[
          { title: "Acceptance of Terms", content: "By accessing or using PixelMint AI, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service." },
          { title: "Service Description", content: "PixelMint AI provides AI-powered image background removal. We offer free and paid tiers with varying usage limits and features." },
          { title: "User Accounts", content: "You are responsible for maintaining the security of your account credentials. You must be at least 13 years old to use our service." },
          { title: "Acceptable Use", content: "You may not use our service for illegal content, copyright infringement, or any purpose that violates applicable laws. We reserve the right to suspend accounts that violate these terms." },
          { title: "Intellectual Property", content: "You retain all rights to images you upload. We do not claim ownership of your content. Our AI models, branding, and platform are our intellectual property." },
          { title: "Payment Terms", content: "Pro subscriptions are billed monthly via Razorpay. Credits are non-refundable. You may cancel your subscription at any time." },
          { title: "Limitation of Liability", content: "PixelMint AI is provided 'as is'. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service." },
          { title: "Changes to Terms", content: "We may update these terms periodically. Continued use after changes constitutes acceptance of the updated terms." },
        ].map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-foreground">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Terms;
