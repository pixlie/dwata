import React, { Fragment } from "react";


const Box = ({ title, message, children }) => {
  return (
    <div className="my-2 p-6 bg-gray-700 rounded shadow-sm">
      <h4 className="text-2xl md:text-3xl text-center subtitle text-white">{title}</h4>
      <p className="text-lg text-center text-white">{message}</p>
      { children }
    </div>
  );
}


export const TeamWork = () => (
  <Box
    title="Team Work"
    message="Onboard everyone quickly and collaborate as a team" />
);

export const Overview = () => (
  <Box
    title="Overview"
    message="Get a high level picture with dashboards, or home screen" />
);

export const Empower = () => (
  <Box
    title="Empower"
    message="Empower your team to stay curious and share learnings" />
);

export const AccessibleInsights = () => (
  <Box
    title="Accessible Insights"
    message="Complex business insights are easy to gather and track" />
);

export const Visual = () => (
  <Box
    title="Visual"
    message="Completely visual UI to question and comprehend the data" />
);

export const Encourage = () => (
  <Box
    title="Encourage"
    message="Ease of use Encourages everyone to participate" />
);

export const NoCode = () => (
  <Box
    title="No Code"
    message="No code to write, minimal management for Engineers" />
);

export const Document = () => (
  <Box
    title="Document"
    message={`In-app Business process Documentation to understand "Why"`} />
);

export const Collaborate = () => (
  <Box
    title="Collaborate"
    message="Create and update insightful queries with co-workers" />
);

export const CRUD = () => (
  <Box
    title="CRUD"
    message="Data CRUD for any Table, including 1-M, M-M Relations" />
);

export const AnyBackend = () => (
  <Box
    title="Any Backend"
    message="Connect your existing Node/PHP/Python/Ruby... logic" />
);

export const AnyRDBMS = () => (
  <Box
    title="Any RDBMS"
    message="Connect with MySQL, MariaDB, PostgreSQL, SQLite, Oracle..." />
);

export const OnPremise = () => (
  <Box
    title="On Premise"
    message="Hosted on your Cloud provider for complete data privacy" />
);

export const Managed = () => (
  <Box
    title="Managed"
    message="Managed hosting on AWS, GCP, Azure, DO, Linode..." />
);

export const IntegrateAPIs = () => (
  <Box
    title="Integrate APIs"
    message="Third-party APIs like Stripe, PayPal, Mailchimp... integrated" />
);

export const Reports = () => (
  <Box
    title="Reports"
    message="Dynamic Reports (per customer/product) on the fly" />
);

export const Funnels = () => (
  <Box
    title="Funnels"
    message="Easily create multi-level funnels to visualize engagement" />
);

export const Settings = () => (
  <Box
    title="Settings"
    message="Change product settings for customers straight from dwata" />
);

export const Metrics = () => (
  <Box
    title="Metrics"
    message="Have key Metrics always on the home screen for everyone to see" />
);

export const Dashboards = () => (
  <Box
    title="Dashboards"
    message="Create dashboards to track what is really important for growth" />
);


const TalkBox = ({ text }) => (
  <div className="max-w-screen-md bg-white rounded-lg mx-2 md:mx-auto mb-6 flex">
    <div className="text-xl p-4 w-4/6">
      { text }
    </div>

    <div className="p-4 border-l-2 border-l-dotted">
      <a className="text-xl bg-blue-500 text-white font-bold hover:bg-blue-800 py-2 px-5 text-center rounded block shadow"
        href="https://calendly.com/brainless/talk-with-sumit" target="_blank"
        rel="noopener noreferrer">Schedule a Call</a>
    </div>
  </div>
)


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

    <TalkBox text={`Let's discuss using dwata for internal needs so you can focus on customers.`} />
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

    <TalkBox text={`Want to easily share vital metrics with all stakeholders?`} />
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

    <TalkBox text={`We can stop fighting with SQL and get productive and grow your business.`} />
  </Fragment>
);