import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NodeFormatDocs() {
  return (
    <div className="w-full h-full p-4 sm:p-6">
      <ScrollArea className="h-full w-full">
        <Card className="border bg-background text-foreground max-w-full">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Node Format Reference
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 px-4 sm:px-6 text-base leading-relaxed max-w-full">
            
            {/* Intro */}
            <p className="text-muted-foreground">
              A <strong>Node</strong> is the building block of the mind map. Each node represents a
              single item with text, size, colors, and border styling. Nodes can later be connected
              to create structured diagrams.
            </p>

            <Separator />

            {/* Node Syntax */}
            <h2 className="text-xl sm:text-2xl font-semibold">Node Syntax</h2>
            <p>Below is the general structure of how a node is defined:</p>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
{`Node "<node-id>" {
  label: "<text inside node>",
  height: <number>,
  width: <number>,
  background color: <color>,
  textcolor: <color>,
  border color: <color>,
}`}
              </pre>
            </div>

            <p className="text-muted-foreground">
              Every field except <strong>label</strong> is optional. If omitted, the system will
              apply default theme values or auto-size the node.
            </p>

            <Separator />

            {/* Connections */}
            <h2 className="text-xl sm:text-2xl font-semibold">Connection Syntax</h2>
            <p>Below is how a connection is defined:</p>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
{`Connection "<connection-id>" {
  source: "<node-id-1>",
  target: "<node-id-2>",
  relation: "text to be displayed on the line"
}`}
              </pre>
            </div>

            <p className="text-muted-foreground">
              <strong>relation</strong> is optional. If omitted, no text will appear on the
              connecting line.
            </p>

            <Separator />

            {/* Field Descriptions */}
            <h2 className="text-xl sm:text-2xl font-semibold">Field Descriptions</h2>

            <div className="space-y-4">
              {[
                ["1. Node ID", "Unique identifier used for connections."],
                ["2. label", "The visible text inside the node. Required."],
                [
                  "3. height & width",
                  "Dimensions in pixels. If missing, size adjusts automatically.",
                ],
                [
                  "4. background color",
                  "Fill color. Supports hex, rgb, named colors, and CSS variables.",
                ],
                ["5. textcolor", "Color of text inside the node."],
                ["6. border color", "Optional border color (defaults to theme border)."],
              ].map(([title, desc], idx) => (
                <div key={idx}>
                  <h3 className="text-lg sm:text-xl font-medium">{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Basic Example */}
            <h2 className="text-xl sm:text-2xl font-semibold">Basic Example</h2>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
{`Node "introduction" {
  label: "What is Machine Learning?",
  height: 90,
  width: 240,
  background color: "#ffffff",
  textcolor: "#000000",
  border color: "#cccccc",
}`}
              </pre>
            </div>

            <Separator />

            {/* Theme Variables */}
            <h2 className="text-xl sm:text-2xl font-semibold">Using Theme Variables</h2>
            <p>You can use theme tokens so nodes adapt to dark/light mode:</p>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
{`Node "theme-demo" {
  label: "Uses Theme Tokens",
  width: 220,
  background color: "var(--card)",
  textcolor: "var(--foreground)",
  border color: "var(--border)",
}`}
              </pre>
            </div>

            <Separator />

            {/* Minimal Example */}
            <h2 className="text-xl sm:text-2xl font-semibold">Minimal Example</h2>
            <p>You can omit everything except the label:</p>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
{`Node "simple-node" {
  label: "Just text!"
}`}
              </pre>
            </div>

            <Separator />

            {/* Multiple Nodes Example */}
            <h2 className="text-xl sm:text-2xl font-semibold">
              Example: Party Planning Mindmap
            </h2>

            <p>
              A demonstration of nodes and connections for organizing a party:
            </p>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
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

Connection "Party_Invites" {
  start: "Party",
  end: "Invitations"
};

Connection "Party_Venue" {
  start: "Party",
  end: "Venue"
};`}
              </pre>
            </div>

            <img
              src="/images/Party_mindmap.png"
              alt="Party mindmap"
              className="w-full rounded-lg mt-4 border max-w-full h-auto object-contain"
            />

            <Separator />

            {/* CS Example */}
            <h2 className="text-xl sm:text-2xl font-semibold">
              Example: Computer Science Curriculum
            </h2>

            <p>
              This example shows relationships between CS courses and topics:
            </p>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
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

Connection "CS_Algo" {
  source: "CS",
  target: "Algorithms"
};`}
              </pre>
            </div>

            <img
              src="/images/CS_mindmap.png"
              alt="CS mindmap"
              className="w-full rounded-lg mt-4 border max-w-full h-auto object-contain"
            />

            <Separator />

            {/* Startup Ecosystem */}
            <h2 className="text-xl sm:text-2xl font-semibold">
              Example: Startup Ecosystem
            </h2>

            <p>This visualizes an entire startup ecosystem:</p>

            <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
              <pre className="whitespace-pre-wrap break-words">
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

Connection "Startup_Funding" {
  source: "Startup",
  target: "Funding"
};`}
              </pre>
            </div>

            <img
              src="/images/Startup_ecosystem_mindmap.png"
              alt="Startup Ecosystem Mindmap"
              className="w-full rounded-lg mt-4 border max-w-full h-auto object-contain"
            />

          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
