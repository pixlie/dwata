import React, { Fragment } from "react";

const Box = ({ title, message, children }) => {
  return (
    <div className="my-2 p-6 bg-gray-700 rounded shadow-sm">
      <h4 className="text-2xl md:text-3xl text-center subtitle text-white">
        {title}
      </h4>
      <p className="text-lg text-center text-white">{message}</p>
      {children}
    </div>
  );
};

export const TeamWork = () => (
  <Box
    title="Team Work"
    message="Onboard everyone quickly and collaborate as a team"
  />
);

export const Overview = () => (
  <Box
    title="Overview"
    message="Get a high level picture with dashboards, or home screen"
  />
);

export const Empower = () => (
  <Box
    title="Empower"
    message="Empower your team to stay curious and share learnings"
  />
);

export const AccessibleInsights = () => (
  <Box
    title="Accessible Insights"
    message="Complex business insights are easy to gather and track"
  />
);

export const Visual = () => (
  <Box
    title="Visual"
    message="Completely visual UI to question and comprehend the data"
  />
);

export const Encourage = () => (
  <Box
    title="Encourage"
    message="Ease of use Encourages everyone to participate"
  />
);

export const NoCode = () => (
  <Box
    title="No Code"
    message="No code to write, minimal management for Engineers"
  />
);

export const Document = () => (
  <Box
    title="Document"
    message={`In-app Business process Documentation to understand "Why"`}
  />
);

export const Collaborate = () => (
  <Box
    title="Collaborate"
    message="Create and update insightful queries with co-workers"
  />
);

export const CRUD = () => (
  <Box
    title="CRUD"
    message="Data CRUD for any Table, including 1-M, M-M Relations"
  />
);

export const AnyBackend = () => (
  <Box
    title="Any Backend"
    message="Connect your existing Node/PHP/Python/Ruby... logic"
  />
);

export const AnyRDBMS = () => (
  <Box
    title="Any RDBMS"
    message="Connect with MySQL, MariaDB, PostgreSQL, SQLite, Oracle..."
  />
);

export const OnPremise = () => (
  <Box
    title="On Premise"
    message="Hosted on your Cloud provider for complete data privacy"
  />
);

export const Managed = () => (
  <Box
    title="Managed"
    message="Managed hosting on AWS, GCP, Azure, DO, Linode..."
  />
);

export const IntegrateAPIs = () => (
  <Box
    title="Integrate APIs"
    message="Third-party APIs like Stripe, PayPal, Mailchimp... integrated"
  />
);

export const Reports = () => (
  <Box
    title="Reports"
    message="Dynamic Reports (per customer/product) on the fly"
  />
);

export const Funnels = () => (
  <Box
    title="Funnels"
    message="Easily create multi-level funnels to visualize engagement"
  />
);

export const Settings = () => (
  <Box
    title="Settings"
    message="Change product settings for customers straight from dwata"
  />
);

export const Metrics = () => (
  <Box
    title="Metrics"
    message="Have key Metrics always on the home screen for everyone to see"
  />
);

export const Dashboards = () => (
  <Box
    title="Dashboards"
    message="Create dashboards to track what is really important for growth"
  />
);

const TalkBox = ({ text }) => (
  <div className="max-w-screen-md bg-white rounded-lg mx-2 md:mx-auto mb-6 flex">
    <div className="text-xl p-4 w-4/6">{text}</div>

    <div className="p-4 border-l-2 border-l-dotted">
      <a
        className="text-xl bg-blue-500 text-white font-bold hover:bg-blue-800 py-2 px-5 text-center rounded block shadow"
        href="https://calendly.com/brainless/talk-with-sumit"
        target="_blank"
        rel="noopener noreferrer"
      >
        Schedule a Call
      </a>
    </div>
  </div>
);

export const Founder = () => (
  <Fragment>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <AccessibleInsights />
      <Overview />
      <Empower />
      <Visual />
      <Encourage />
      <TeamWork />
    </div>

    <TalkBox text={`Let's talk how everyone can be on deck and empowered.`} />
  </Fragment>
);

export const SoftwareEngineer = () => (
  <Fragment>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <CRUD />
      <AnyBackend />
      <AnyRDBMS />
      <IntegrateAPIs />
      <OnPremise />
      <Managed />
    </div>

    <TalkBox
      text={`Let's discuss using dwata for internal needs so you can focus on customers.`}
    />
  </Fragment>
);

export const ProductManager = () => (
  <Fragment>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Overview />
      <NoCode />
      <Reports />
      <Funnels />
      <Visual />
      <Settings />
    </div>

    <TalkBox
      text={`Want to easily share vital metrics with all stakeholders?`}
    />
  </Fragment>
);

export const MarketerSalesExec = () => (
  <Fragment>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <NoCode />
      <Reports />
      <Metrics />
      <Dashboards />
      <Collaborate />
      <Visual />
    </div>

    <TalkBox
      text={`We can stop fighting with SQL and get productive and grow your business.`}
    />
  </Fragment>
);

export default () => {
  const [state, setState] = useState({
    selectedAudience: "Founder",
  });
  const { selectedAudience } = state;

  const Audience = ({ title }) => {
    const setAudience = (event) => {
      if (selectedAudience === title) {
        setState({
          selectedAudience: null,
        });
      } else {
        setState({
          selectedAudience: title,
        });
      }
    };
    const classes =
      selectedAudience === title
        ? "font-bold bg-gray-700 text-white p-2 px-4 mr-2 mb-2 md:mb-0 rounded-full shadow inline-block cursor-pointer"
        : "font-bold bg-green-300 p-2 px-4 mr-2 mb-2 md:mb-0 rounded-full shadow inline-block cursor-pointer";

    return (
      <div className={classes} onClick={setAudience}>
        {title}
      </div>
    );
  };

  return (
    <Fragment>
      <div className="max-w-screen-md flex bg-white rounded-lg p-4 mx-2 md:mx-auto">
        <img
          className="h-16 w-16 md:h-24 md:w-24 rounded-full mr-6 mb-3"
          alt="Avatar of Sumit Datta, founder of dwata"
          src="https://ph-avatars.imgix.net/1966591/original?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=120&h=120&fit=crop"
        />

        <p className="text-lg">
          Hello and welcome!
          <br />
          I'm Sumit and I've worked with 10+ startups over 14 years as an
          Engineer. I help Businesses scale their Operations without writing
          Code.
          <br />
          &nbsp;
          <br />
          What's your professional role?
        </p>
      </div>

      <div className="container mx-2 md:mx-0 md:flex md:justify-center my-3">
        <Audience title="Founder" />
        <Audience title="Software Engineer" />
        <Audience title="Product Manager" />
        <Audience title="Marketer/Sales Exec" />
      </div>

      <div className="max-w-screen-lg mx-2 md:mx-auto">
        {selectedAudience === "Founder" ? <Founder /> : null}
        {selectedAudience === "Software Engineer" ? <SoftwareEngineer /> : null}
        {selectedAudience === "Product Manager" ? <ProductManager /> : null}
        {selectedAudience === "Marketer/Sales Exec" ? (
          <MarketerSalesExec />
        ) : null}
      </div>
    </Fragment>
  );
};
