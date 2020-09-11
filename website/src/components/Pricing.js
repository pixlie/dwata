import React, { Fragment } from "react";

import { Hero, Hx } from "components/LayoutHelpers";
import SignupEarlyAccess from "components/SignupEarlyAccess";

export default () => (
  <Fragment>
    <Hero>
      <Hx x="1">Simple pricing, free to start</Hx>
      <Hx x="3" titleClass="subtitle">
        Start with the feature packed, MIT licensed Community Edition, upgrade
        when needed
      </Hx>
      <p className="text-xl">
        <strong>dwata</strong> is an on-premise product for complete privacy of
        your data.
      </p>
      <p className="text-xl">
        All editions come with unlimited users and connections to unlimited
        databases.
      </p>
    </Hero>

    <Hero gap="py-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded border border-green-300">
          <div className="block bg-green-200 text-xl p-2">
            No credit card needed
          </div>
          <div className="text-md p-2">
            <Hx x="4">Free forever</Hx>
            <ul>
              <li>
                <strong>Community Edition</strong>
              </li>
              <li>Open Source, self-managed</li>
              <li>Community support</li>
            </ul>

            <a
              className="inline-block text-md px-8 py-2 rounded bg-green-500 text-white font-bold hover:bg-blue-800 my-6"
              href="https://github.com/brainless/dwata"
            >
              <strong>Clone from GitHub!</strong>
            </a>
          </div>
        </div>

        <div className="bg-white rounded border border-indigo-300">
          <div className="block bg-indigo-200 text-xl p-2">Coming soon</div>
          <div className="text-md p-2">
            <Hx x="4">&#x24; 399/month</Hx>
            <ul>
              <li>
                <strong>Business Edition</strong>
              </li>
              <li>Build Reports</li>
              <li>Invite guests, with custom permissions</li>
              <li>Import CSV, export PDF</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded border border-purple-300">
          <div className="block bg-purple-200 text-xl p-2">Coming soon</div>
          <div className="text-md p-2">
            <Hx x="4">&#x24; 999/month</Hx>
            <ul>
              <li>
                <strong>Enterprise Edition</strong>
              </li>
              <li>Integrate existing Business logic</li>
              <li>Integrate Stripe, PayPal, other API data</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>
      </div>
    </Hero>

    <SignupEarlyAccess />
  </Fragment>
);
