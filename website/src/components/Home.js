import React, { Fragment, useEffect } from "react";

import { Section, Hx } from "components/LayoutHelpers";
import SignupEarlyAccess from "components/SignupEarlyAccess";
import RelatedAndFiltersTour1 from "assets/Product_Tour/Product_tour_v4_Header_Search.gif";
import RelatedAndFiltersTour2 from "assets/Product_Tour/Product_tour_v4_Merge.gif";
import RelatedAndFiltersTour3 from "assets/Product_Tour/Product_tour_v4_Merge_Columns.gif";
import RelatedAndFiltersTour5 from "assets/Product_Tour/Related_and_Filters_Tour_5.png";

export default () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Fragment>
      <Section extraClasses="bg-white">
        <div className="max-w-screen-lg md:py-12 mx-2 md:mx-auto">
          <Hx x="1">Manage Databases without knowing SQL</Hx>
          <p className="text-3xl">
            <strong>dwata</strong> has an easy to use interface that is familiar
            like Spreadsheets. Even for complex related data,{" "}
            <strong>dwata</strong> takes care of all the SQL/code so you do not
            have to.
          </p>
        </div>
      </Section>

      <div className="bg-indigo-100 py-24">
        <div className="mx-auto" style={{ maxWidth: "1100px" }}>
          <Hx x="3">Easy to use and automatic interface for Databases</Hx>
          <p className="my-4 p-4 bg-red-200 rounded-lg text-lg font-bold">
            <strong>dwata</strong> finds out all tables, columns and relations
            and gives you a Spreadsheet like GUI, no code needed
          </p>
        </div>
        <div
          className="mx-auto rounded-lg border-4"
          style={{ maxHeight: "600px", maxWidth: "1100px", overflow: "hidden" }}
        >
          <img
            className="w-full"
            src={RelatedAndFiltersTour1}
            alt="Screenshot of a grid for a table"
          />
        </div>
      </div>

      <SignupEarlyAccess />

      <div className="bg-purple-100 py-24">
        <div className="mx-auto" style={{ maxWidth: "1100px" }}>
          <Hx x="3">View related Tables, just by checking the box</Hx>
          <p className="my-4 p-4 bg-orange-200 rounded-lg text-lg font-bold">
            You can merge data from multiple tables{" "}
            <span className="bg-orange-300 px-1">without knowing SQL</span>.
            Also for Grouping, Aggregate, Pivots, etc.
          </p>
        </div>
        <div
          className="mx-auto rounded-lg border-4"
          style={{ maxHeight: "600px", maxWidth: "1100px", overflow: "hidden" }}
        >
          <img
            className="w-full"
            src={RelatedAndFiltersTour2}
            alt="Screenshot of two tables merged in a grid"
          />
        </div>
      </div>

      {/* <div className="bg-yellow-400 py-1 px-2 inline-block rounded">Signup to get early access!</div> */}

      <div className="mx-auto max-w-xl p-6 border-4 rounded-lg my-32">
        <Hx x="4">Are you a Founder?</Hx>
        <div className="text-lg">
          <p>
            With <strong>dwata</strong> you can enable everyone in your business
            to get complex insights with the ease of Spreadsheet. You can also
            give permissions to modify the data easily.
          </p>
        </div>
      </div>

      <div className="bg-orange-100 py-24">
        <div className="mx-auto" style={{ maxWidth: "1100px" }}>
          <Hx x="3">Easily work with deeply related data</Hx>
          <p className="my-4 p-4 bg-red-200 rounded-lg text-lg font-bold">
            <strong>dwata</strong> manages the SQL for Tables/Columns, including
            Filters, JOINs and sub-queries
          </p>
        </div>
        <div
          className="mx-auto rounded-lg border-4"
          style={{ maxHeight: "600px", maxWidth: "1100px", overflow: "hidden" }}
        >
          <img
            className="w-full"
            src={RelatedAndFiltersTour3}
            alt="Screenshot of funnels to understand user behaviour"
          />
        </div>
      </div>

      <div className="mx-auto max-w-xl p-6 border-4 rounded-lg my-32">
        <Hx x="4">Are you a Developer?</Hx>
        <div className="text-lg">
          <p>
            <strong>dwata</strong> comes with content management, CRUD, and UX
            for complex queries. You will not have to setup SQL dashboards. It's
            on-premise for complete privacy.
          </p>
        </div>
      </div>

      <div className="bg-purple-100 py-24">
        <div className="mx-auto" style={{ maxWidth: "1100px" }}>
          <Hx x="3">Integers or Dates? dwata handles for you</Hx>
          <p className="my-4 p-4 bg-orange-200 rounded-lg text-lg font-bold">
            <strong>dwata</strong> supports Boolean, Integer, Date/Time,
            Geolocation, etc. so you can focus on Business insights
          </p>
        </div>
        <div
          className="mx-auto rounded-lg border-4"
          style={{ maxHeight: "600px", maxWidth: "1100px", overflow: "hidden" }}
        >
          <img
            className="w-full"
            src={RelatedAndFiltersTour5}
            alt="Screenshot of funnels to understand user behaviour"
          />
        </div>
      </div>
    </Fragment>
  );
};
