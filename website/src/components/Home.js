import React, { Fragment, useEffect } from "react";

import { FeatureImageBox, Hero, Hx } from "components/LayoutHelpers";
import SignupEarlyAccess from "components/SignupEarlyAccess";
import RelatedAndFiltersTour1 from "assets/Product_Tour/Product_tour_v5_Header_Search.gif";
import RelatedAndFiltersTour2 from "assets/Product_Tour/Product_tour_v4_Merge.gif";
import RelatedAndFiltersTour3 from "assets/Product_Tour/Product_tour_v4_Merge_Columns.gif";
import RelatedAndFiltersTour5 from "assets/Product_Tour/Related_and_Filters_Tour_5.png";

export default () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Fragment>
      <Hero extraClasses="bg-white">
        <Fragment>
          <Hx x="1">
            Manage Databases
            <br /> without knowing SQL
          </Hx>
          <p className="max-w-screen-md text-2xl">
            <strong>dwata</strong> is an easy to use, Spreadsheet like software
            for your database. It takes care of all the SQL, even for complex
            tables or queries. It runs <strong>on-premise</strong> for complete
            privacy.
          </p>

          <div
            className="relative w-full overflow-hidden mt-8 mb-12"
            style={{ paddingTop: "56.2%" }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/EzZ0v5QKsiY"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <p className="my-8">
            <a
              className="py-3 px-8 text-white font-bold text-2xl rounded shadow-md bg-blue-500 hover:bg-blue-800"
              href="https://demo.dwata.com"
            >
              Try the demo!
            </a>
          </p>
        </Fragment>
      </Hero>

      <FeatureImageBox
        extraClasses="bg-indigo-100"
        heading="Easy to use and automatic interface for Databases"
        subHeading={
          <Fragment>
            <strong>dwata</strong> finds out all tables, columns and relations
            and gives you a Spreadsheet like GUI, no code needed
          </Fragment>
        }
        imageSrc={RelatedAndFiltersTour1}
        imageAlt="Screenshot of a grid for a table"
      />

      <SignupEarlyAccess />

      <FeatureImageBox
        extraClasses="bg-purple-100"
        heading="View related Tables, just by checking the box"
        subHeading={
          <Fragment>
            You can merge data from multiple tables{" "}
            <span className="bg-orange-300 px-1">without knowing SQL</span>.
            Also for Grouping, Aggregate, Pivots, etc.
          </Fragment>
        }
        imageSrc={RelatedAndFiltersTour2}
        imageAlt="Screenshot of two tables merged in a grid"
      />

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

      <FeatureImageBox
        extraClasses="bg-orange-100"
        heading="Easily work with deeply related data"
        subHeading={
          <Fragment>
            <strong>dwata</strong> manages the SQL for Tables/Columns, including
            Filters, JOINs and sub-queries
          </Fragment>
        }
        imageSrc={RelatedAndFiltersTour3}
        imageAlt="Screenshot of funnels to understand user behaviour"
      />

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

      <FeatureImageBox
        extraClasses="bg-purple-100"
        heading="Integers or Dates? dwata handles for you"
        subHeading={
          <Fragment>
            <strong>dwata</strong> supports Boolean, Integer, Date/Time,
            Geolocation, etc. so you can focus on Business insights
          </Fragment>
        }
        imageSrc={RelatedAndFiltersTour5}
        imageAlt="Screenshot of funnels to understand user behaviour"
      />
    </Fragment>
  );
};
