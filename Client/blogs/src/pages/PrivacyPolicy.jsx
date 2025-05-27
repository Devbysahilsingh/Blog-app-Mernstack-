import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const effectiveDate = new Date().toLocaleDateString();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF9C4] to-[#F5F5F5] dark:from-[#1C1C1E] dark:to-[#2C2C2E] py-10 px-6">
      <article className="max-w-4xl mx-auto backdrop-blur-lg bg-white/70 dark:bg-[#2C2C2E]/70 border border-[#FFD600]/40 dark:border-[#FDD835]/20 rounded-3xl shadow-xl p-8 md:p-12">
        <header className="flex justify-center flex-col items-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#0D0D0D] dark:text-[#FFF9C4] mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-md text-[#2C2C2E] dark:text-[#FFD600]">
            Effective Date: {effectiveDate}
          </p>
        </header>

        <p className="text-lg text-[#1C1C1E] dark:text-[#F5F5F5] mb-8 leading-relaxed">
          At Kapil Gattani, your privacy is important to us. This Privacy Policy explains how we collect,
          use, and protect your personal information when you visit our website or use our services.
        </p>

        <div className="space-y-10">
          {[
            {
              title: '1. Information We Collect',
              content: (
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and contact details</li>
                  <li>Demographic information</li>
                  <li>Feedback, comments, or questions submitted via forms</li>
                  <li>Website usage data (via cookies and analytics tools)</li>
                </ul>
              ),
            },
            {
              title: '2. How We Use Your Information',
              content: (
                <ul className="list-disc pl-6 space-y-2">
                  <li>Improve our website and services</li>
                  <li>Respond to your inquiries or feedback</li>
                  <li>Send updates, newsletters, or promotional content (only if you opt-in)</li>
                  <li>Analyze user behavior to enhance user experience</li>
                </ul>
              ),
            },
            {
              title: '3. Sharing Your Information',
              content: (
                <>
                  <p className="mb-4">
                    We do <strong>not</strong> sell, rent, or trade your personal information. We may share information only:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With trusted service providers who assist in operating our website</li>
                    <li>To comply with legal obligations or protect our rights</li>
                  </ul>
                </>
              ),
            },
          ].map((section, index) => (
            <Section key={index} title={section.title}>
              {section.content}
            </Section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block bg-[#FFD600] dark:bg-[#FDD835] text-black font-semibold px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-md"
            aria-label="Return to the homepage"
          >
            Back to Home
          </Link>
        </div>
      </article>
    </main>
  );
};

const Section = ({ title, children }) => (
  <section className="rounded-xl p-6 bg-yellow-300 dark:bg-[#1C1C1E]/80 shadow-inner ring-1 ring-[#FFD600]/20 dark:ring-[#FDD835]/10">
    <h2 className="text-2xl font-bold text-[#0D0D0D] dark:text-[#FFF9C4] mb-4">{title}</h2>
    <div className="text-[#1C1C1E] dark:text-[#F5F5F5] text-base leading-relaxed">{children}</div>
  </section>
);

export default PrivacyPolicy;
