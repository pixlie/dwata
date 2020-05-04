import React, { Fragment } from "react";

import { Hero, Hx, Section, Box } from "components/BulmaHelpers";
import SourceScreenshot from "asset/dwata_screenshot_Source_select.png";
import SearchScreenshot from "asset/dwata_screenshot_unified_search.png";


export default () => (
  <Fragment>
    <Hero size="is-medium" textCentered={true}>
      <div className="tag is-warning is-medium">This is pre-product marketing!</div>
      <Hx x="1">All your data, sans the frustration</Hx>
      <Hx x="4" titleClass="subtitle">SQL Databases and third party
      Services (Stripe, GA, MailChimp...) in one Admin</Hx>
    </Hero>

    <Section size="is-large">
      <div className="columns">
        <div className="column is-4">
          <Box
            title="Admin for SQL data"
            message="Data viewer and admin for your MySQL or PostgreSQL database(s).
            Independent of the language or framework of your App."
          />
        </div>
        <div className="column is-4">
          <Box
            title="Third party Services data"
            message="Browse data from third party services in the same Admin.
            Also, with Webhooks you get live updates from those services."
          />
        </div>
        <div className="column is-4">
          <Box
            title="Merge SQL and Services data"
            message="With minimal config, tell dwata how your SQL data relates
            to data from Services. Like shipping status for your Orders."
          />
        </div>
      </div>
    </Section>

    <Section>
      <Hx x="2">SQL Databases <i className="fas fa-heart" /> Services: all in one team</Hx>
      <figure className="image is-2by1 has-box-shadow">
        <img src={SourceScreenshot} alt="Screenshot of dwata with choices for data sources" />
      </figure>
    </Section>

    <Hero size="is-large" textCentered={true}>
      <div className="tag is-warning is-medium">This is pre-product marketing!</div>
      <Hx x="1">Be productive right from the first moment</Hx>
      <Hx x="4" titleClass="subtitle">Search across your own App data and third party
      Services data from the same interface.</Hx>
    </Hero>

    <Section>
      <Hx x="2">Unified search: nothing escapes</Hx>
      <figure className="image is-2by1 has-box-shadow">
        <img src={SearchScreenshot} alt="Screenshot of dwata with unified search across SQL Databases and Services" />
      </figure>
    </Section>

    <Hero size="is-large" textCentered={true}>
      <div className="tag is-warning is-medium">This is pre-product marketing!</div>
      <Hx x="1">Your Data - your ownership, our assistance</Hx>
      <Hx x="4" titleClass="subtitle">dwata is hosted on your server on any VPS of your choice,
      our scripts to get it going.</Hx>
    </Hero>

    <Section>
      <Hx x="2">Pricing so simple, it just makes sense</Hx>
      <div className="columns">
        <div className="column is-4">
          <div className="tag is-info is-medium">First 30 days are free</div>
          <Hx x="1" titleClass="subtitle">&#x24; 12/month</Hx>
          <div className="box">
            <div className="content is-medium">
              Included <strong>25 team members</strong> using dwata.
              <br />Plus &#x24; 5/month for each additional 25 team members.
              &nbsp;<span className="has-text-grey">eg. 90 members = &#x24; 27/month.</span>
            </div>
          </div>
        </div>

        <div className="column is-4">
          <div className="tag is-success is-medium">No credit card needed</div>
          <Hx x="1" titleClass="subtitle">Free forever</Hx>
          <div className="box">
            <div className="content is-medium">
              Free for <strong>individuals</strong>, single person businesses.
              <br />Same for <strong>non-profit organizations</strong> of any team size.
            </div>
          </div>
        </div>

        <div className="column is-4">
          <Hx x="3" titleClass="subtitle">Your hosting cost</Hx>
          <div className="content">
            Since dwata has access to your SQL and Services data,
            we deem most companies will want to host it themseleves.
            <br />This is not a big cost, a &#x24; 5/month server should be good for individuals and small businesses.Plus you can specify Office Hours, so the server for dwata is not running outside those hours.
          </div>
        </div>
      </div>
    </Section>
  </Fragment>
);