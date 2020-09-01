import React, { Fragment, useEffect, useState } from "react";

import { Section, Hx } from "components/LayoutHelpers";
import SignupEarlyAccess from "components/SignupEarlyAccess";
import { Founder, SoftwareEngineer, ProductManager, MarketerSalesExec } from "components/AudiencePitch";
import KanbanViewScreenshot from "assets/dwata_screenshot_Kanban_view.png";
import DetailViewScreenshot from "assets/dwata_screenshot_Detail_view.png";
import TableFiltersScreenshot from "assets/dwata_screenshot_Table_Filters.png";
import NotesScreenshot from "assets/dwata_screenshot_Notes.png";


const AudiencePitch = () => {
  const [ state, setState ] = useState({
    selectedAudience: "Founder",
  });
  const { selectedAudience } = state;

  const Audience = ({ title }) => {    
    const setAudience = event => {
      if (selectedAudience === title) {
        setState({
          selectedAudience: null,
        })
      } else {
        setState({
          selectedAudience: title,
        });
      }
    }
    const classes = selectedAudience === title ?
      "font-bold bg-gray-700 text-white p-2 px-4 mr-2 mb-2 md:mb-0 rounded-full shadow inline-block cursor-pointer" :
      "font-bold bg-green-300 p-2 px-4 mr-2 mb-2 md:mb-0 rounded-full shadow inline-block cursor-pointer"
 
    return (
      <div
        className={classes}
        onClick={setAudience}>{title}</div>
    );
  }

  return (
    <Fragment>
      <div className="max-w-screen-md flex bg-white rounded-lg p-4 mx-2 md:mx-auto">
        <img className="h-16 w-16 md:h-24 md:w-24 rounded-full mr-6 mb-3"
          alt="Avatar of Sumit Datta, founder of dwata"
          src="https://ph-avatars.imgix.net/1966591/original?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=120&h=120&fit=crop" />

        <p className="text-lg">
          Hello and welcome!<br />I'm Sumit and I've worked with 10+ startups over 14 years as an Engineer.
          I help Businesses scale their Operations without writing Code.
          <br />&nbsp;<br />What's your professional role?
        </p>
      </div>

      <div className="container mx-2 md:mx-0 md:flex md:justify-center my-3">
        <Audience title="Founder" />
        <Audience title="Software Engineer" />
        <Audience title="Product Manager" />
        <Audience title="Marketer/Sales Exec" />
      </div>

      <div className="max-w-screen-lg mx-2 md:mx-auto">
        { selectedAudience === "Founder" ? <Founder /> : null }
        { selectedAudience === "Software Engineer" ? <SoftwareEngineer /> : null }
        { selectedAudience === "Product Manager" ? <ProductManager /> : null }
        { selectedAudience === "Marketer/Sales Exec" ? <MarketerSalesExec /> : null }
      </div>
    </Fragment>
  )
}

export default () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <Fragment>
      <Section extraClasses="bg-white">
        <div className="max-w-screen-lg md:py-24 mx-2 md:mx-auto">
          <Hx x="1">Scale Your Business Operations</Hx>
          <Hx x="2" titleClass="subtitle">Without Investing in Software</Hx>
          <p className="text-3xl">
            <strong>dwata</strong> helps your team manage &amp; understand the Business without fighting with SQL databases or third-party APIs.
          </p>
        </div>

        {/* <div className="bg-yellow-400 py-1 px-2 inline-block rounded">Signup to get early access!</div> */}

        {/* <div className="max-w-screen-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="max-w-xl my-12 p-6 bg-gray-100 shadow-md">
            <Hx x="4">Scaling your business?</Hx>
            <div className="text-lg">
              <p>
                <strong>dwata</strong> makes it easy to onboard your entire team and empower them to
                understand and modify your Business data. There is <strong>no need to learn SQL</strong>;
                visually query all the data, share queries, create dashboards and explore.
              </p>
            </div>
          </div>

          <div className="max-w-xl my-12 p-6 bg-gray-100 shadow-md">
            <Hx x="4">Are you a developer?</Hx>
            <div className="text-lg">
              <p>
                <strong>dwata</strong> gives you <strong>content management, CRUD, visual queries</strong>,
                and much more. Works with your existing backend, database and APIs directly.
                It is on-premises for complete privacy. Give your team members an excellent admin!
              </p>
            </div>
          </div>
        </div> */}
      </Section>

      <Section>
        <AudiencePitch />
      </Section>

      {/* <Section>
        <Hx x="2" titleClass="subtitle">Do you want to understand?</Hx>
        <ul>
          <li className="text-2xl">Where users spend time on our product?</li>
          <li className="text-2xl">Do they interact with our new features?</li>
          <li className="text-2xl">Or if your efforts are not having impact?</li>
        </ul>
      </Section> */}

      <SignupEarlyAccess />

      <Section>
        <div className="max-w-screen-lg mx-2 md:mx-auto text-center">
          <Hx x="2">Understand User Behaviour with Funnels</Hx>
        </div>

        <img
          className="w-full mx-auto rounded-lg shadow-lg"
          style={{maxWidth: "1100px"}}
          src={KanbanViewScreenshot}
          alt="Screenshot of funnels to understand user behaviour" />
      </Section>

      <Section extraClasses="bg-white">
        <div className="max-w-screen-lg mx-2 md:mx-auto text-center">
          <Hx x="2">Explore Data and Insights, no SQL Needed</Hx>
        </div>

        <img
          className="w-full mx-auto rounded-lg shadow-md"
          style={{maxWidth: "1000px"}}
          src={TableFiltersScreenshot}
          alt="Screenshot of filtering data from Relational database without SQL knowledge" />
      </Section>

      <Section>
        <div className="max-w-screen-lg mx-2 md:mx-auto text-center">
          <Hx x="2">Business Documentation/Notes in dwata</Hx>
        </div>

        <img
          className="w-full mx-auto rounded-lg shadow-lg"
          style={{maxWidth: "1100px"}}
          src={NotesScreenshot}
          alt="Screenshot of Business documentation/notes directly in dwata" />
      </Section>

      <Section extraClasses="bg-white">
        <div className="max-w-screen-lg mx-2 md:mx-auto text-center">
          <Hx x="2">Data Management, Including Relations</Hx>
        </div>

        <img
          className="w-full mx-auto rounded-lg shadow-md"
          style={{maxWidth: "1000px"}}
          src={DetailViewScreenshot}
          alt="Screenshot of Data management (CRUD) for SQL data, including Relations" />
      </Section>
    </Fragment>
  );
}