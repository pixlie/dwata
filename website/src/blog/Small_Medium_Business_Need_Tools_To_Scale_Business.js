import React from "react";
import ReactMarkdown from "react-markdown";

import VideoEmbed from "components/VideoEmbed";


const segments = [
`
# Why Small and Medium Businesses need Better Tools to Scale their Business

Small and Medium businesses are usually neglected by Enterprise level application developers
since the margins to be made from selling software licenses to them are not that great. A lot
of SaaS products target Small and Medium businesses though and that is really helpful.

The average business need a lot of tooling to make life easy and scale up operations.
These tools would need to also talk to other tools that are in use at other businesses, like
at the vendor, supplier or client side. Managing a lot of applications might seem too much of
work for more Small businesses in particular. A lot of the promised efficiency can be extracted
only with teams of a certain minimum size. This makes pricing of applications even worse for
Small businesses since it is a volume game, and to serve so many Small businesses, application
developers need a large support team.

Given all this background, there is still no doubt in general that Small and Medium Businesses
need Software applications to scale and operate with efficiency. Let's look at some broad
segments of such applications and how a Small or Medium Business can benefit from them.

## Inventory Management
This is perhaps the most common of application for manufacturing or online commerce businesses.
Inventory can mean both sale side, as you see on an eCommerce platform, as well as supply side,
which fits well with manufacturing companies. In that case vendor management would also be
integrated into this.
`,
[VideoEmbed, {
  youTubeVideo: "fsPkrUfSi_c"
}],
`
## Customer Relationship Management
This segment is perhaps the one with the biggest buzz and for good reasons. Businesses need to
manage, understand, support their customers. The more in-depth knowledge about a customer we have
the better we are able to support them. CRM tools vary is how deeply they connect with the sale
process of the Business but any popular tool is a good place to start if you are not using one yet.

## Content Creation
More and more businesses are looking at selling directly to consumers through the Internet. Even
many B2B Businesses use the Internet to get leads. This requires multiple approaches to lead
generation and one of these ways is to create content. This Blog is in fact a content based lead
generation tool for **dwata**.

## Document Management
Documents are important to all kinds of businesses and it can be vital for some specific type of
businesses. Documents can range from presentations, manuals, product design or specifications to
blueprints and legal documents. Some of these are very important in day to day operations while
others are important for the existence of the company. It is usually the first type of Documents,
the ones needed for day to day operations that we need to manage and share the most. Dropbox is
perhaps one of the most well known document management software out there.

## Team Collaboration
Unless a Business is a one of two person business, it will probably need some way to enable team
members to collaborate with each other. Team collaboration tools can include simple WhatsApp chat
group to Slack, task management tools, etc. Email also becomes very central to team who share access
to the business email accounts. Teams may also want to collaborate on managing communication channels
like support, social media marketing or supplier/vendor management, etc.


## Project Management
What starts as simple task management (maybe under the label of Team Collaboration) might gradually
need more attention and need its own set of tools. Project Management is needed across all sorts of
Businesses but they become more important within businesses that are in manufacturing or are constantly
evolving their own products.

## Data Collection
This is perhaps a bit specific as a business tool but a lot of businesses need to gather important
data from either their suppliers, customers, vendors or consumers. The data collection might look like
one-on-one calls to gather insight or surveys sent out to much large audiences. These data points
then need to be analysed and perhaps drilled down in order to understand what next steps could be
for the Business.
`
];


export default () => (
  <div className="blog-post">
    {segments.map(x => {
      if (typeof(x) === "string") {
        return <ReactMarkdown source={x} />;
      }
      const Element = x[0];
      const childProps = x[1];
      return <Element {...childProps} />;
    })}
  </div>
);