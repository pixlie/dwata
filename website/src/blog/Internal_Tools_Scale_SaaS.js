import React from "react";
import ReactMarkdown from "react-markdown";


const text = `
# Internal Tools to Help Scale SaaS Business

A SaaS or Software as a Service Business is one where the developers of the software host
and manage the software themselves on their hosting infrastructure of choice and share access
with Businesses that want to use the software. Usually the Businesses are charged on a monthly
or yearly basis and also per employee the Business has.

Building a SaaS Business has been one of the most common ways to a software oriented business
for many years now. There are many benefits to building and managing a SaaS which include:
* Ownership of the software deployment process
* Rapid turn-around time since changes are near-instantly available to customers
* Easier to serve clients since things are centralized
* Usually higher gross revenues compared to on-premise software

SaaS businesses that reach product-market-fit can grow really fast. Reaching product-market-fit
is not easy for any kind of business but there is benefit that SaaS businesses can monetize
on their centralized nature. They can add infrastructure as a whole and benefit from the per user
license model that they usually follow.
`;


export default () => (
  <div className="blog-post">
    <ReactMarkdown source={text} />
  </div>
);