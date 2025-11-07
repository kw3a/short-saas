import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Terms of Service</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: November 5, 2025</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-5">
          <p>
            By using viralshort (“Service” or “Services”), you agree to be bound by the following terms and conditions (“Terms of Service”).
          </p>

          <p>
            viralshort is owned and operated by Aldair Torrez (“Owner”, “we”, “us”, or “our”). We reserve the right to update and change these Terms of Service at any time without prior notice.
          </p>

          <p>
            These Terms form a binding agreement between you and us. By using the Services in any manner, you agree to all of these Terms, as well as the provisions in our Privacy Policy. If you do not agree to these Terms, you may not use the Services.
          </p>

          <p>
          Violation of any of the following terms may result in suspension or termination of your account.
          </p>

          <h2 className="text-xl font-bold mb-4"><strong>Account terms</strong></h2>
          <p>
            As a viralshort user:
          </p>
          <p>
            1. You are responsible for maintaining the security of your account. We cannot and will not be liable for any loss or damage arising from your failure to comply with this obligation.
          </p>
          <p>
            2. You are responsible for all activity that occurs under your account, including any content created, generated, or processed.
          </p>
          <p>
            3. You may not use the Service for any illegal purpose or to violate any laws in your jurisdiction, including but not limited to copyright laws.
          </p>
          <p>
            4. Accounts registered by automated methods (“bots”) are not permitted. Only human users may register.
          </p>

          <h2 className="text-xl font-bold mb-4"><strong>Payments and refunds</strong></h2>
          <p>
            1. Credits are a virtual currency used to access the generation features of the Service.
          </p>
          <p>
            2. Credits are allocated to your account upon successful payment through Polar. Once allocated, credits have no expiration date and are non-refundable, except where required by law.
          </p>
          <p>
            3. Payments are processed securely by Polar, who acts as the Merchant of Record (MoR).
          </p>

          <h2 className="text-xl font-bold mb-4"><strong>Acceptable Use and Restrictions</strong></h2>
          <p>
            You agree not to use the Service in any way that:
          </p>
          <p>
            1. Infringes or violates the intellectual property rights, privacy rights, or any other rights of others;
          </p>
          <p>
            2. Violates any applicable laws or regulations;
          </p>
          <p>
            3. Is fraudulent, harassing, defamatory, obscene, or otherwise objectionable;
          </p>
          <p>
            4. Gains unauthorized access to any part of the Service or other users’ data;
          </p>
          <p>
            5. Involves reverse engineering, scraping, automated data collection, or circumvention of technical limits;
          </p>
          <p>
            6. Overloads or interferes with the performance and stability of the Service infrastructure.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts that violate these restrictions.
          </p>

          <h2 className="text-xl font-bold mb-4"><strong>Copyright and Content Ownership</strong></h2>
          <p>
            1. Users retain all rights to the content they create using viralshort.
          </p>
          <p>
            2. We do not pre-screen user content but reserve the right (though not the obligation) to remove content deemed unlawful, harmful, or in violation of these Terms.
          </p>
          
          <h2 className="text-xl font-bold mb-4"><strong>General Conditions</strong></h2>
          <p>
            1. The Service is provided “as is” and “as available,” without warranties of any kind, either express or implied.
          </p>
          <p>
            2. Technical support is available via email at support@viralshort.app
          </p>
          <p>
            3. We rely on third-party vendors and hosting providers to deliver the Service’s infrastructure.
          </p>
          <p>
            4. You may not modify, adapt, or hack the Service or falsely imply association with it.
          </p>
          <p>
            5. You agree not to reproduce, sell, or resell any portion of the Service without written consent.
          </p>
          <p>
            6. Data transmissions may occur over various networks and may involve changes to meet technical requirements.
          </p>
          <p>
            7. We reserve the right to temporarily suspend or limit accounts that exceed typical usage patterns to ensure fair resource allocation.
          </p>
          <p>
            8. We do not guarantee that: a) The Service will meet your requirements, b) The Service will be uninterrupted or error-free, c) Results will be accurate or reliable, or d) Any defects will be corrected.
          </p>
          <p>
            9. We shall not be liable for any indirect, incidental, or consequential damages, including data loss, loss of profits, or interruption of Service.
          </p>
          <p>
            10. The failure to enforce any provision of these Terms shall not be deemed a waiver of our rights.
          </p>
          <p>
            11. These Terms constitute the entire agreement between you and us concerning your use of the Service.
          </p>
          <p>
            12. Any new features or updates remain subject to these Terms, and continued use of the Service after updates constitutes acceptance.
          </p>
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
