import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const effectiveDate = new Date().toLocaleDateString();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: (
        <p>
          By using this website, you confirm that you have read, understood, and agreed to be bound by these terms.
          If you do not agree with any part of these terms, you should not use our services.
        </p>
      )
    },
    {
      title: '2. Changes to Terms',
      content: (
        <p>
          We reserve the right to update or modify these Terms of Service at any time without prior notice.
          Your continued use of the site after any changes indicates your acceptance of the new terms.
        </p>
      )
    },
    {
      title: '3. Use of Website',
      content: (
        <p>
          You agree to use this website for lawful purposes only. You may not use the site in any way
          that could damage, disable, overburden, or impair our servers or networks.
        </p>
      )
    },
    {
      title: '4. Intellectual Property',
      content: (
        <>
          <p className="mb-4">
            All content, including text, graphics, logos, and images, is the property of Kapil Gattani
            and is protected by intellectual property laws.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You may not copy, reproduce, or distribute any content without written permission.</li>
          </ul>
        </>
      )
    },
    {
      title: '5. User Submissions',
      content: (
        <p>
          If you submit any content, feedback, or suggestions, you grant us a non-exclusive,
          royalty-free, worldwide license to use, modify, and publish it in any media.
        </p>
      )
    },
    {
      title: '6. Limitation of Liability',
      content: (
        <p>
          We are not liable for any direct, indirect, incidental, or consequential damages resulting
          from your use of our website or services. All information provided is for educational and
          informational purposes only.
        </p>
      )
    },
    {
      title: '7. Third-Party Links',
      content: (
        <p>
          Our website may contain links to third-party sites. We are not responsible for the content,
          privacy policies, or practices of these websites.
        </p>
      )
    },
    {
      title: '8. Termination',
      content: (
        <p>
          We reserve the right to terminate or restrict access to our website at our discretion,
          without notice, for any reason, including a violation of these terms.
        </p>
      )
    },
    {
      title: '9. Governing Law',
      content: (
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of India,
          and any disputes shall be subject to the exclusive jurisdiction of the courts in that location.
        </p>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-[#F5F5F5] dark:bg-[#1C1C1E] py-10 px-6">
      <article className="max-w-4xl mx-auto bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-lg border border-[#FFD600]/30 dark:border-[#FFF9C4]/10 rounded-2xl shadow-lg p-8 md:p-12">
        <header className="flex justify-center items-center flex-col mb-10">
          <h1 className="text-4xl font-extrabold text-[#0D0D0D] dark:text-[#FFF9C4] mb-2">
            Terms of Service
          </h1>
          <p className="text-md text-[#2C2C2E] dark:text-[#FFD600]">
            Effective Date: {effectiveDate}
          </p>
        </header>

        <section className="mb-8">
          <p className="text-lg text-[#0D0D0D] dark:text-[#F5F5F5] leading-relaxed">
            Welcome to Kapil Gattani. By accessing or using our services, you agree to be bound by
            the following Terms of Service. Please read them carefully.
          </p>
        </section>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <section
              key={index}
              className="rounded-xl bg-yellow-300 dark:bg-[#2C2C2E]/60 border border-[#FFD600]/10 p-6 shadow-md"
            >
              <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-[#FDD835] mb-3">
                {section.title}
              </h2>
              <div className="text-[#2C2C2E] dark:text-[#F5F5F5] text-base leading-relaxed">
                {section.content}
              </div>
            </section>
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

export default TermsOfService;
