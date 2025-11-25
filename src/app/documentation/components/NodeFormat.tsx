import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Documentation page for Node Format using shadcn components
export default function NodeFormatDocs() {
  return (
    <div className="w-full h-full p-6">
      <ScrollArea className="h-full w-full">
        <Card className="border bg-background text-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Node Format Reference</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-base leading-relaxed">
            <p>
              A <strong>Node</strong> is the building block of the mind map. Each node represents a single
              item with text, size, colors, and border styling. Nodes can later be connected to
              create structured diagrams.
            </p>

            <Separator />

            <h2 className="text-2xl font-semibold">Node Syntax</h2>
            <p>Below is the general structure of how a node is defined:</p>

            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Node "<node-id>" {
  label: "<text inside node>",
  height: <number>,
  width: <number>,
  background color: <color>,
  textcolor: <color>,
  border color: <color>,
}`}
            </pre>

            <p className="text-muted-foreground">
              Every field except <strong>label</strong> is optional. If omitted, the system will apply the
              default theme values or auto-size the node.
            </p>

            <Separator />

            <h2 className="text-2xl font-semibold">Connection Syntax</h2>
            <p>Below is the general structure of how a connection between nodes is defined:</p>

            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Connection "<connection-id>" {
  source: "<node-id-1>",
  target: "<node-id-2>",
  relation: "text to be displayed on the line"
}`}
            </pre>

            <p className="text-muted-foreground">Here the <strong>relation</strong> field is optional and if you don't apply there will be no text displayed above the line connecting nodes</p>

            <Separator />

            <h2 className="text-2xl font-semibold">Field Descriptions</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium">1. Node ID</h3>
                <p>
                  Appears after the <code>Node</code> keyword. This must be a unique identifier and is used
                  when connecting nodes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium">2. label</h3>
                <p>
                  The visible text content inside the node. This is required.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium">3. height & width</h3>
                <p>
                  Dimensions of the node (in pixels). If skipped, the node auto-adjusts based on text.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium">4. background color</h3>
                <p>
                  Sets the fill color of the node. Supports hex, rgb, named colors, and CSS variables.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium">5. textcolor</h3>
                <p>Color of the text inside the node.</p>
              </div>

              <div>
                <h3 className="text-xl font-medium">6. border color</h3>
                <p>Sets the border color. Optional—defaults to a neutral theme border.</p>
              </div>
            </div>

            <Separator />

            <h2 className="text-2xl font-semibold">Basic Example</h2>
            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Node "introduction" {
  label: "What is Machine Learning?",
  height: 90,
  width: 240,
  background color: "#ffffff",
  textcolor: "#000000",
  border color: "#cccccc",
}`}
            </pre>

            <Separator />

            <h2 className="text-2xl font-semibold">Using Theme Variables</h2>
            <p>
              You can use theme tokens to ensure the node adapts to dark/light mode automatically.
            </p>

            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Node "theme-demo" {
  label: "Uses Theme Tokens",
  width: 220,
  background color: "var(--card)",
  textcolor: "var(--foreground)",
  border color: "var(--border)",
}`}
            </pre>

            <Separator />

            <h2 className="text-2xl font-semibold">Minimal Example</h2>
            <p>
              If you only want a label, you can omit every styling property. Defaults will be applied.
            </p>

            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Node "simple-node" {
  label: "Just text!"
}`}
            </pre>

            <Separator />

            <h2 className="text-2xl font-semibold">An example consisting of multiple Nodes</h2>
            <p>Here is an example which demonstrates how a party is organized with the help of 
              attributes like invites and other and how they are related to other attributes.
            </p>
            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Node "Party" {
  label: "Plan a Party",
  width: 200,
  background color: "#ffffff",
  border color: "#000000"
};

Node "Invitations" {
  label: "Invitations",
  width: 170
};

Node "Venue" {
  label: "Venue",
  width: 150
};

Node "Food" {
  label: "Food",
  width: 150
};

Node "Cake" {
  label: "Order Cake",
  width: 150
};

Connection "Party_Invites" {
  start: "Party",
  end: "Invitations"
};

Connection "Party_Venue" {
  start: "Party",
  end: "Venue"
};

Connection "Party_Food" {
  start: "Party",
  end: "Food"
};

Connection "Party_Cake" {
  start: "Party",
  end: "Cake"
};
`}
            </pre>
            <img src="/images/Party_mindmap.png" alt="A mindmap which demonstrates what are the things required in a party" />

            <h2 className="text-2xl font-semibold">Another example with relatively more nodes</h2>
            <p>Here is an example which demonstrates the relationship between Computer Science it's courses 
              like Algorithms, Data Structures, Operating Systems and Computer Networks, and within courses there are subjects
              mentioned for reference.
            </p>
            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Node "CS" {
  label: "Computer Science",
  width: 230
  x: 100,
  y: 200
};

Node "Algorithms" {
  label: "Algorithms",
  width: 180,
  x: -200,
  y: 400
};

Node "DS" {
  label: "Data Structures",
  width: 200,
  x: 50,
  y: 400
};

Node "OS" {
  label: "Operating Systems",
  width: 200,
  x: 300,
  y: 400
};

Node "Networks" {
  label: "Computer Networks",
  width: 210,
  x: 600,
  y: 400
};

Node "Sorting" {
  label: "Sorting Algorithms",
  width: 220,
  x: -250,
  y: 600
};

Node "Trees" {
  label: "Trees",
  width: 150,
  x: 80,
  y: 600
};

Connection "CS_Algo" {
  source: "CS",
  target: "Algorithms"
};
Connection "CS_DS" {
  source: "CS",
  target: "DS"
};
Connection "CS_OS" {
  source: "CS",
  target: "OS"
};
Connection "CS_Networks" {
  source: "CS",
  target: "Networks"
};
Connection "Algorithms_Sorting" {
  source: "Algorithms",
  target: "Sorting"
};
Connection "DS_Trees" {
  source: "DS",
  target: "Trees"
};`
}
            </pre>
            <img src="/images/CS_mindmap.png" alt="A mindmap that visualizes relationship between CS its courses and its topics" />
            <h2 className="text-2xl font-semibold">Another example of mindmap - Startup Ecosystem</h2>
            <p>This mindmap visualizes a complete startup ecosystem, showing how funding, team building, product development, and marketing interact across multiple hierarchical and cross-linked layers.
            </p>
            <pre className="bg-muted p-4 rounded-lg border text-sm overflow-auto">
{`Node "Startup" {
  label: "Startup Ecosystem",
  width: 260,
  x: 200,
  y: 100
};

Node "Funding" {
  label: "Funding",
  width: 160,
  x: -200,
  y: 300
};

Node "Team" {
  label: "Team Building",
  width: 180,
  x: 50,
  y: 300
};

Node "Product" {
  label: "Product Development",
  width: 240,
  x: 350,
  y: 300
};

Node "Marketing" {
  label: "Marketing",
  width: 160,
  x: 700,
  y: 300
};

Node "Investors" {
  label: "Investors",
  width: 140,
  x: -250,
  y: 500
};

Node "Recruit" {
  label: "Hiring",
  width: 140,
  x: 50,
  y: 500
};

Node "MVP" {
  label: "Build MVP",
  width: 160,
  x: 250,
  y: 500
};

Node "Research" {
  label: "Market Research",
  width: 180,
  x: 450,
  y: 500
};

Node "UserFeedback" {
  label: "User Feedback",
  width: 180,
  x: 650,
  y: 500
};

Node "Branding" {
  label: "Branding",
  width: 150,
  x: 700,
  y: 700
};

Connection "Startup_Funding" {
  source: "Startup",
  target: "Funding"
};

Connection "Startup_Team" {
  source: "Startup",
  target: "Team"
};

Connection "Startup_Product" {
  source: "Startup",
  target: "Product"
};

Connection "Startup_Marketing" {
  source: "Startup",
  target: "Marketing"
};

Connection "Funding_Investors" {
  source: "Funding",
  target: "Investors"
};

Connection "Team_Recruit" {
  source: "Team",
  target: "Recruit"
};

Connection "Product_MVP" {
  source: "Product",
  target: "MVP"
};

Connection "Product_Research" {
  source: "Product",
  target: "Research"
};

Connection "Product_Feedback" {
  source: "Product",
  target: "UserFeedback"
};

Connection "Marketing_Branding" {
  source: "Marketing",
  target: "Branding"
};

Connection "MVP_Feedback" {
  source: "MVP",
  target: "UserFeedback"
};

Connection "Research_Branding" {
  source: "Research",
  target: "Branding"
};`
}
            </pre>
            <img src="/images/Startup_ecosystem_mindmap.png" alt="" />
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
