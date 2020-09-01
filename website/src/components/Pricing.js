import React, { Fragment } from "react";

import { Section, Hx } from "components/LayoutHelpers";
import SignupEarlyAccess from "components/SignupEarlyAccess";


export default () => (
  <Fragment>
    <Section style={{
      backgroundColor: "white",
    }}>
      <Hx x="1">On Premise and Managed Hosting</Hx>
      <Hx x="3" titleClass="subtitle">We manage the server for you and provide support</Hx>
      <div className="text-xl">
        Since <strong>dwata</strong> has access to your SQL and API data, we deem most companies will want on-premise hosting.
      </div>
    </Section>

    <Section>
      <Hx x="2">Simple pricing that makes sense</Hx>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded">
          <div className="block bg-green-200 text-xl p-2">30 days trial</div>
          <Hx x="2" titleClass="subtitle ml-2">&#x24; 99</Hx>
          <div className="text-lg p-2">
            <ul>
              <li><strong>Unlimited</strong> team members, data sources</li>
              <li><strong>First</strong> hosted server (1) included</li>
              <li>&#x24; 69 for each additional server</li>
              <li>Scheduled phone &amp; 12 hours email support</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded">
          <div className="block bg-green-200 text-xl p-2">No credit card needed</div>
          <Hx x="2" titleClass="subtitle ml-2">Free forever</Hx>
          <div className="text-lg p-2">
            <ul>
              <li><strong>One</strong> hosted server (1) only</li>
              <li>Community support</li>
              <li>For non profits</li>
              <li>For &lt; 1 year old businesses</li>
            </ul>
          </div>
        </div>
      </div>

      <p>&nbsp;</p>

      <div className="text-lg">
        Specific needs? Wondering if <strong>dwata</strong> can solve your Business needs?<br />&nbsp;<br />
      </div>
      <a className="text-2xl bg-blue-500 text-white font-bold hover:bg-blue-800 py-2 px-6 rounded inline-block shadow"
        href="https://calendly.com/brainless/talk-with-sumit" target="_blank"
        rel="noopener noreferrer">Schedule a call</a>

      <p>&nbsp;</p>

      <div className="bg-white rounded max-w-screen-sm px-2 py-1 pb-2">
        <Hx x="4" titleClass="subtitle">(1) server: in our context</Hx>
        <div className="text-lg">
          <ul>
            <li><strong>dwata</strong> does not price by your team members</li>
            <li>Each server assumed to be VPS with 1GB RAM, 2 vCPU</li>
            <li>Multiples of these are counted as additional servers</li>
          </ul>
        </div>
      </div>
    </Section>

    {/* <Hero size="is-medium" textCentered={true} style={{
      backgroundColor: "white",
    }}>
      <div className="tag is-warning is-medium">This is pre-product marketing!</div>
      <Hx x="1">Be productive right from the first moment</Hx>
      <Hx x="4" titleClass="subtitle">Bring your team, work together, see bottlenecks, collaborate.</Hx>
    </Hero> */}

    <SignupEarlyAccess />
  </Fragment>
);