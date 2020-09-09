import React, { Fragment } from "react";

import { Section, Hx } from "components/LayoutHelpers";
import SignupEarlyAccess from "components/SignupEarlyAccess";

export default () => (
  <Fragment>
    <Section
      style={{
        backgroundColor: "white",
      }}
    >
      <Hx x="1">On Premise and Managed Hosting</Hx>
      <Hx x="3" titleClass="subtitle">
        We manage the server for you and provide support
      </Hx>
      <div className="text-xl">
        Since <strong>dwata</strong> has access to your SQL and API data, we
        deem most companies will want on-premise hosting.
      </div>
    </Section>

    <Section>
      <Hx x="2">Simple pricing that makes sense</Hx>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border-2">
          <div className="block bg-green-200 text-xl p-2">
            No credit card needed
          </div>
          <Hx x="2" titleClass="subtitle ml-2">
            Free forever
          </Hx>
          <div className="text-lg p-2">
            <ul>
              <li>
                <strong>Community Edition</strong>
              </li>
              <li>Open Source, self-managed</li>
              <li>Community support</li>
            </ul>

            <a
              className="inline-block text-md px-3 py-1 rounded bg-green-500 text-white font-bold hover:bg-blue-800 my-6"
              href="https://github.com/brainless/dwata"
            >
              <strong>Go to GitHub!</strong>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2">
          <div className="block bg-green-200 text-xl p-2">Coming soon</div>
          <Hx x="2" titleClass="subtitle ml-2">
            &#x24; 399/month
          </Hx>
          <div className="text-lg p-2">
            <ul>
              <li>
                <strong>Enterprise Edition</strong>
              </li>
              <li>Integrate with existing Business logic</li>
              <li>Integrate with Stripe, PayPal, other APIs</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>

    <SignupEarlyAccess />
  </Fragment>
);
