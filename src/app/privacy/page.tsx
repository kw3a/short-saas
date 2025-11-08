import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy — ViralShort",
  description: "Read how ViralShort handles your data, Google OAuth usage, storage, sharing, and deletion policies.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: November 5, 2025</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-5">
          <p>
            viralshort is a product made by Aldair Torrez (“we”, “us”, or “our”). We know you care about how your personal
            information is used and shared, and we take your privacy seriously. Please read the following to learn more about our
            Privacy Policy. By using or accessing the Services ("viralshort") in any manner, you acknowledge that you accept the
            practices and policies outlined in this Privacy Policy, and you hereby consent that we will collect, use, and share your
            information in the following ways.
          </p>

          <p>
            We’ll only ever access your account to help you with a problem or squash a software bug. We’ll never open any private
            content unless you ask us to.
          </p>

          <p>
            You can sign up with your Google account so your viralshort account email will be prefilled with your Google account's
            email.
          </p>

          <p>
            We don't share any personally identifying information publicly or with third parties, except when required to by law.
          </p>

          <p>
            We act in the capacity of a data controller and a data processor with regard to the personal data processed through
            viralshort and the services in terms of the applicable data protection laws, including the EU General Data Protection
            Regulation (GDPR).
          </p>

          <p>
            Our website may link to external sites that are not operated by us. Please be aware that we have no control over the
            content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </p>

          <p>
            You are free to refuse our request for your personal information, with the understanding that we may be unable to provide
            you with some of your desired services.
          </p>

          <p>
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information.
            If you have any questions about how we handle user data and personal information, feel free to contact us.
          </p>

          <h2 className="text-xl font-bold mb-4"><strong>Use of Google User Data</strong></h2>
          <p>
            <strong>Access: </strong>Our application allows you to sign in using your Google account through the OAuth 2.0 protocol. When you choose to sign in with Google, we receive limited information from your Google profile.
          </p>
          <p>
            <strong>Usage: </strong>We only access and store your Google account name and email address for the sole purpose of authentication and account management within the Service. This information is not used for any other purpose, including advertising or data analytics.
          </p>
          <p>
            <strong>Storage: </strong> Your Google user data (name and email) is securely stored in our Neon-hosted database located in the United States. All data is encrypted in transit and at rest. Authentication and security are managed through BetterAuth.
          </p>
          <p>
            <strong>Sharing: </strong> We do not share Google user data with any third parties, except when required by law. We ensure that all data usage is limited to the practices explicitly disclosed in this privacy policy.
          </p>
          <p>
            <strong>Compliance: </strong> viralshort's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy (https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.
          </p>

          <p>
            <strong>Data Sharing and Third-Party Tools: </strong>
            Our application uses and shares the inputs provided by users with sub-processors to generate videos. No user data is used
            to train AI models.
          </p>

          <p>
            <strong>Deleting Your Data: </strong>
            You can delete your viralshort account at any time by sending an email to
            {" "}
            <a href="mailto:support@viralshort.app" className="underline underline-offset-4">support@viralshort.app</a>.
            {" "}
            This will delete all data associated with your account, including your Google user data.
          </p>

          <hr className="my-10 border-zinc-800" />
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
