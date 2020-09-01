import React from "react";
import ReactMarkdown from "react-markdown";


const text = `
# What Options Exist to Host or Manage Business Software?

A modern day Business needs access to many critical Software Applications that help in managing
the business. The tools are often available in two forms: SaaS and On-premise. SaaS, as many of
us might be aware of is a business model for software developers to host their software solutions
on their own hosting setup and give Business users access to it. Usually this access is charged
on a monthly or yearly basis with a per user subscription. Basically a Business is charged per
employee.

The On-premise option is one where the Business hosts the software application on servers that it
has itself. These servers are then the responsibility of the Business and usually not the
software developer (vendor). Actually on-premise hosting is divided into two ways of managing the
server/hosting: Self-managed and Managed hosting.

With Self-managed hosting, all the responsibility of hosting the software, its database, backups
and associated machinery are on the Business. Self hosting has been a well know option for many
Small and Medium businesses or even individuals.

WordPress hosted on your own server is perhaps the most common example. Everything from setting up
WordPress to taking backups and securing it is the responsibility of the owner of the blog. There are
many web hosting companies which make this process really easy and so you could argue that it is not
self managed hosting at all.

For software that is more complex than WordPress, Businesses usually do not wish to manage the hosting.
This is not a core skill of most Businesses and all they really care about it 
`;


export default () => (
  <div className="blog-post">
    <ReactMarkdown source={text} />
  </div>
);