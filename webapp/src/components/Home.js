import React, { Fragment } from "react";

import { Hero, Hx, Section, Box } from "components/BulmaHelpers";
import SourceScreenshot from "asset/dwata_screenshot_Source_select.png";
import SearchScreenshot from "asset/dwata_screenshot_unified_search.png";
import Fox from "asset/fox.png";
import Giraffe from "asset/giraffe.png";


export default () => (
  <Fragment>
    <Hero size="is-fullheight" textCentered={true} style={{
      backgroundImage: `url(${Fox})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center bottom",
      borderBottom: "1px solid #999",
    }}>
      <div className="tag is-warning is-medium">This is pre-product marketing!</div>
      <Hx x="1">All your data, sans the frustration</Hx>
      <Hx x="4" titleClass="subtitle">SQL Databases and third party
      Services (Stripe, GA, MailChimp...) in one Admin</Hx>
    </Hero>

    <Section size="is-large" style={{
      backgroundColor: "white",
    }}>
      <Hx x="2">SQL Databases <i className="fas fa-plus" /> Services: all on your side</Hx>
      <figure className="image is-2by1 has-box-shadow">
        <img src={SourceScreenshot} alt="Screenshot of dwata with choices for data sources" />
      </figure>
    </Section>

    <Section size="is-medium" style={{
      backgroundImage: `url(${Giraffe})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right bottom",
      borderTop: "1px solid #999",
      borderBottom: "1px solid #999",
    }}>
      <div className="columns">
        <div className="column is-1" />
        <div className="column is-6">
          <Hx x="2">Admin for SQL data</Hx>
          <div className="content is-medium">Data viewer and admin for your MySQL or PostgreSQL database(s).
            Independent of the language or framework of your App.</div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-1" />
        <div className="column is-6">
          <Hx x="2">Third party Services data</Hx>
          <div className="content is-medium">Browse data from third party services in the same Admin.
            Also, with Webhooks you get live updates from those services.</div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-1" />
        <div className="column is-6">
          <Hx x="2">Merge SQL and Services data</Hx>
          <div className="content is-medium">With minimal config, tell dwata how your SQL data relates
            to data from Services. Like shipping status for your Orders.</div>
        </div>
      </div>
    </Section>

    <Hero size="is-large" textCentered={true}>
      <div className="tag is-warning is-medium">This is pre-product marketing!</div>
      <Hx x="1">Be productive right from the first moment</Hx>
      <Hx x="4" titleClass="subtitle">Search across your own App data and third party
      Services data from the same interface.</Hx>
    </Hero>

    <Section size="is-medium" style={{
      backgroundImage: `url(${Giraffe})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right bottom",
      borderTop: "1px solid #999",
      borderBottom: "1px solid #999",
    }}>
      <div className="columns">
        <div className="column is-1" />
        <div className="column is-6">
          <Hx x="2">Admin for the entire team</Hx>
          <div className="content is-medium">Everyone in your business deserves a better tool to see
            or manage all the data. Invite everyone, with different access levels.</div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-1" />
        <div className="column is-6">
          <Hx x="2">Make bottlenecks visible</Hx>
          <div className="content is-medium">Mark issues like pending Orders (issue in Supply), or
            cancelled cards (Payments/CRM) visible to entire team.</div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-1" />
        <div className="column is-6">
          <Hx x="2">Temporary guest invitation</Hx>
          <div className="content is-medium">Share temporary invites with your clients or suppliers,
            so they can colaborate better with your business processes.</div>
        </div>
      </div>
    </Section>

    <Section size="is-large" style={{
      backgroundColor: "white",
      borderBottom: "1px solid #999",
    }}>
      <Hx x="2">Unified search: nothing escapes</Hx>
      <figure className="image is-2by1 has-box-shadow">
        <img src={SearchScreenshot} alt="Screenshot of dwata with unified search across SQL Databases and Services" />
      </figure>
      <div className="content is-medium"><i>This is not the correct screenshot</i></div>
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
          <div className="box has-no-shadow">
            <div className="tag is-info is-medium">First 30 days are free</div>
            <Hx x="1" titleClass="subtitle">&#x24; 15/month</Hx>
            <div className="content is-medium">
              <ul>
                <li>Included <strong>25</strong> accounts</li>
                <li>&#x24; 5/month for each additional 10 accounts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="column is-4">
          <div className="box has-no-shadow">
            <div className="tag is-success is-medium">No credit card needed</div>
            <Hx x="1" titleClass="subtitle">Free forever</Hx>
            <div className="content is-medium">
              <ul>
                <li><strong>1</strong> account only</li>
                <li><strong>25</strong> accounts for registered <strong>non profits</strong></li>
              </ul>
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