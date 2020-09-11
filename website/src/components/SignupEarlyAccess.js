import React from "react";

import { Hero, Hx } from "components/LayoutHelpers";

export default () => (
  <Hero>
    <div id="Get_Early_Access" />

    <div className="max-w-screen-lg">
      <Hx x="3">Subscribe and get early access!</Hx>
      <p className="text-xl my-2">
        <strong>dwata</strong> is developed actively and we are looking to pilot
        with startups/businesses.
      </p>
      {/* Begin Mailchimp Signup Form */}
      <div className="rounded-lg bg-gray-200 px-3 py-2">
        <form
          action="https://dwata.us8.list-manage.com/subscribe/post?u=637faf509a5896debdab58eda&amp;id=d781c5751b"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate
        >
          <div>
            <div className="field">
              <label htmlFor="mce-EMAIL" className="block text-xl font-bold">
                Subscribe to our newsletter
              </label>
              <input
                className="inline-block my-2 text-xl border rounded py-2 px-4"
                type="email"
                name="EMAIL"
                id="mce-EMAIL"
                placeholder="someone@domain.com"
                required
              />
              <input
                type="submit"
                value="Subscribe"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="text-xl text-white font-bold bg-blue-500 hover:bg-blue-800 rounded border ml-6 py-2 px-12"
              />
            </div>
            {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
            <div
              style={{ position: "absolute", left: "-5000px" }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_637faf509a5896debdab58eda_d781c5751b"
                tabIndex="-1"
              />
            </div>
          </div>
        </form>
      </div>
      {/* End mc_embed_signup */}
    </div>
  </Hero>
);
