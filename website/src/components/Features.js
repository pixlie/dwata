import React, { Fragment, useEffect } from "react";

import { Section, Hero, Hx } from "components/LayoutHelpers";
import SignupEarlyAccess from "components/SignupEarlyAccess";
import TableViewScreenshot from "assets/dwata_screenshot_Table_view.png";
import TableFiltersScreenshot from "assets/dwata_screenshot_Table_Filters.png";
import DetailViewScreenshot from "assets/dwata_screenshot_Detail_view.png";
import KanbanViewScreenshot from "assets/dwata_screenshot_Kanban_view.png";
import NotesScreenshot from "assets/dwata_screenshot_Notes.png";


export default () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <Fragment>
      <Hero size="is-medium">
        <Hx x="1">A feature packed admin software</Hx>
        <Hx x="3" titleClass="subtitle">And needs very minimal configuration to manage</Hx>
        <div className="content is-medium">
          <p>
            <strong>dwata</strong> understands your database structure automagically and generates all the fields, filters, etc. that you can use.<br />
            It can also connect to APIs like Stripe, PayPal, Mailchimp, etc. if you are using them.<br />
            So your team can browse of merge that data directly into the admin without write any code.
          </p>
        </div>
      </Hero>

      <Section size="is-medium" style={{
        backgroundColor: "white",
      }}>
        <Hx x="2">Drilling into Business data has never been easier</Hx>
        <div className="columns">
          <div className="column is-3">
            <div className="content is-medium">
              <p>No need to deal with SQL, filters are all <strong>visual</strong>.</p>
              <p><strong>Ranges</strong> for numbers, calendars for date (also ranges), text search make your life easier.</p>
              <p>Multi-table filters, <strong>aggregates, averages</strong>, etc. are coming soon.</p>
            </div>
          </div>

          <div className="column is-9">
            <figure className="image is-2by1 has-box-shadow">
              <img src={TableFiltersScreenshot} alt="Screenshot of dwata showing mutliple filters for SQL data" />
            </figure>
          </div>
        </div>
      </Section>

      <Section size="is-medium">
        <Hx x="2">Keep Notes  for easy documentation</Hx>
        <div className="columns">
          <div className="column is-9">
            <figure className="image is-2by1 has-box-shadow">
              <img src={NotesScreenshot} alt="Screenshot of example grid view of data from an SQL table" />
            </figure>
          </div>

          <div className="column is-3">
            <div className="content is-medium">
              <p>Make it easy to <strong>onboard team members</strong> to different aspects of your Business.</p>
              <p>An in-admin <strong>documentation</strong> process means everyone can contribute to <strong>Business knowhow</strong>.</p>
            </div>
          </div>
        </div>
      </Section>

      <SignupEarlyAccess />

      <Section size="is-medium">
        <Hx x="2">Funnel analysis with Kanban view</Hx>
        <div className="columns">
          <div className="column is-9">
            <span className="tag is-warning is-medium">Coming soon! Want this? Sign up for early access!</span>
            <figure className="image is-2by1 has-box-shadow">
              <img src={KanbanViewScreenshot} alt="Screenshot of example grid view of data from an SQL table" />
            </figure>
          </div>

          <div className="column is-3">
            <div className="content is-medium">
              <p>Familiar Kanban view; your team members will love to understand <strong>user behaviour</strong>.</p>
              <p><strong>Measure</strong> how (often) your users are engaging with your product (or not).</p>
              <Hx x="4" titleClass="subtitle">Funneled Filters</Hx>
              <p>Each column to the right can filter data as subset of previous column (to its left).</p>
            </div>
          </div>
        </div>
      </Section>

      <Section size="is-medium" style={{
        backgroundColor: "white",
      }}>
        <Hx x="2">A familiar Grid to browse data</Hx>
        <div className="columns">
          <div className="column is-9">
            <figure className="image is-2by1 has-box-shadow">
              <img src={TableViewScreenshot} alt="Screenshot of example grid view of data from an SQL table" />
            </figure>
          </div>

          <div className="column is-3">
            <div className="content is-medium">
              <p>Easy for everyone to start with, looks like a Spreadsheet but works with your Business data.</p>
              <p>Works with MySQL, PostgreSQL or SQLite.</p>
              <p>You can also browse data from Mailchimp, Stripe, PayPal, etc.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section size="is-medium">
        <Hx x="2">Manage your Business like a pro!</Hx>
        <div className="columns">
          <div className="column is-9">
            <figure className="image is-2by1 has-box-shadow">
              <img src={DetailViewScreenshot} alt="Screenshot of a Detail view of a record from SQL table in dwata" />
            </figure>
          </div>

          <div className="column is-3">
            <div className="content is-medium">
              <p>See all the properties (columns) of any record.</p>
              <p>Data types are automagically figure out by <strong>dwata</strong>.</p>
              <p><strong>dwata</strong> also figures out which columns are likely to be meta data.</p>
            </div>
          </div>
        </div>
      </Section>
    </Fragment>
  );
}