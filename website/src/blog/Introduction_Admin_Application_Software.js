import React from "react";
import ReactMarkdown from "react-markdown";


const text = `
# Introduction to Admin Application Software for Businesses

Most businesses that need custom software for data/content management and workflows usually build them
using frameworks like (Python) Django, (Ruby) Rails, (PHP) Laravel, (NodeJS) Express, and similar. There
are popular (Web) Frameworks in every programming language that is geared towards building consumer
facing Internet applications.

The purpose of a good Web (Application) Framework is to reduce the friction to start building customer
software for specific Business needs. In general they make it easy to:

* Model the data required to manage the Business needs
* Translate those Models (from the programming language) into a Relational Database
* Create and manage Business logic to handle users' requests
* Create views that the user sees and forms that users interacts with
* Create APIs so other systems (even other Businesses) can interact with your services
* Integrate other APIs to interact with existing services from other service providers
* Administer Business data through internal tools
* Handle complex Workflows by building multi-step views/forms for internal/external users

There are perhaps a lot more issues that Web Frameworks enable you to tackle efficiently, but the above list
is a decent start. The main selling point of these frameworks is how rapidly you can develop your custom
software and deploy that to your servers. Getting Business needs sorted rapidly and managed with ease is
the long term aim here.

`;


export default () => (
  <div className="blog-post">
    <ReactMarkdown source={text} />
  </div>
);