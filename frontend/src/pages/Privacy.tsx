const Privacy = () => (
  <div className="min-h-screen bg-background">
    <div className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 prose prose-invert prose-sm">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: April 13, 2026</p>
        
        {[
          { title: "Information We Collect", content: "We collect information you provide when creating an account (email, name) and images you upload for processing. We also collect usage data including IP address, browser type, and interaction patterns." },
          { title: "How We Use Your Information", content: "Your information is used to provide our background removal service, process payments, improve our AI models (anonymized data only), and communicate service updates." },
          { title: "Image Data", content: "Uploaded images are processed in real-time and automatically deleted after 30 days. We do not permanently store your images or use them for any purpose beyond providing the requested service." },
          { title: "Data Security", content: "We implement industry-standard encryption (TLS 1.3) for data in transit and AES-256 for data at rest. Access to user data is strictly limited to authorized personnel." },
          { title: "Third-Party Services", content: "We use Razorpay for payment processing and Cloudinary for temporary image storage. These services have their own privacy policies." },
          { title: "Your Rights", content: `You can request access to, correction of, or deletion of your personal data at any time by contacting support@pixelmintai.com.` },
          { title: "Contact", content: `For privacy-related inquiries, contact us at privacy@pixelmintai.com.` },
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

export default Privacy;
