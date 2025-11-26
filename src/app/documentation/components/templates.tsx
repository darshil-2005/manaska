import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MindmapTypesSection1() {
  return (
    <div className="w-full h-full p-4 sm:p-6">
      <ScrollArea className="h-full w-full">
        <Card className="border bg-background text-foreground max-w-full">
          
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Mindmap Templates
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-10 px-4 sm:px-6 text-base leading-relaxed max-w-full">

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                1. Hierarchical Mindmap Template
              </h2>

              <p className="text-muted-foreground mb-4">
                A top-down structure ideal for academic subjects, organizational trees,
                category hierarchies, or structured outlines.
              </p>

              <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
                <pre className="whitespace-pre-wrap break-words">
{`Node "Root" {
  label: "Main Topic",
  width: 220,
  x: 200,
  y: 100
};

Node "BranchA" {
  label: "Branch A",
  width: 200,
  x: -150,
  y: 300
};

Node "BranchB" {
  label: "Branch B",
  width: 200,
  x: 200,
  y: 300
};

Node "BranchC" {
  label: "Branch C",
  width: 200,
  x: 550,
  y: 300
};

/* Subtopics */
Node "A1" { label: "Subtopic A1", width: 180, x: -250, y: 500 };
Node "A2" { label: "Subtopic A2", width: 180, x: -50, y: 500 };
Node "B1" { label: "Subtopic B1", width: 180, x: 100, y: 500 };
Node "B2" { label: "Subtopic B2", width: 180, x: 300, y: 500 };
Node "C1" { label: "Subtopic C1", width: 180, x: 450, y: 500 };
Node "C2" { label: "Subtopic C2", width: 180, x: 700, y: 500 };

/* Connections */
Connection "Root_A" { source: "Root", target: "BranchA" };
Connection "Root_B" { source: "Root", target: "BranchB" };
Connection "Root_C" { source: "Root", target: "BranchC" };

Connection "A_A1" { source: "BranchA", target: "A1" };
Connection "A_A2" { source: "BranchA", target: "A2" };
Connection "B_B1" { source: "BranchB", target: "B1" };
Connection "B_B2" { source: "BranchB", target: "B2" };
Connection "C_C1" { source: "BranchC", target: "C1" };
Connection "C_C2" { source: "BranchC", target: "C2" };`}
                </pre>
              </div>

              <img
                src="/images/mind-map_type_1.png"
                alt="Hierarchical Mindmap"
                className="w-full max-w-full h-auto mt-4 rounded-lg border object-contain"
              />
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                2. Flowchart / Process Mindmap Template
              </h2>

              <p className="text-muted-foreground mb-4">
                Ideal for workflows, pipelines, procedures, multi-step processes,
                decision-making sequences, and lifecycle diagrams.
              </p>

              <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
                <pre className="whitespace-pre-wrap break-words">
{`Node "Start" { label: "Start Process", width: 200, x: 200, y: 100 };
Node "Step1" { label: "Step 1: Input", width: 220, x: 200, y: 250 };
Node "Decision" { label: "Decision Point", width: 200, x: 200, y: 400 };
Node "PathA" { label: "Option A", width: 180, x: -100, y: 550 };
Node "PathB" { label: "Option B", width: 180, x: 400, y: 550 };
Node "Merge" { label: "Merge Paths", width: 200, x: 200, y: 700 };
Node "Step2" { label: "Step 2: Process", width: 220, x: 200, y: 850 };
Node "End" { label: "End Process", width: 200, x: 200, y: 1000 };

/* Connections */
Connection "Flow_Start_1" { source: "Start", target: "Step1" };
Connection "Flow_1_D" { source: "Step1", target: "Decision" };
Connection "Decision_A" { source: "Decision", target: "PathA" };
Connection "Decision_B" { source: "Decision", target: "PathB" };
Connection "A_Merge" { source: "PathA", target: "Merge" };
Connection "B_Merge" { source: "PathB", target: "Merge" };
Connection "Merge_S2" { source: "Merge", target: "Step2" };
Connection "S2_End" { source: "Step2", target: "End" };`}
                </pre>
              </div>

              <img
                src="/images/Flow_chart.png"
                alt="Flowchart mindmap"
                className="w-full max-w-full h-auto mt-4 rounded-lg border object-contain"
              />
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                3. Cluster / Category Mindmap Template
              </h2>

              <p className="text-muted-foreground mb-4">
                Ideal for ecosystems, semantic groups, category breakdowns, and large conceptual models.
              </p>

              <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
                <pre className="whitespace-pre-wrap break-words">
{`Node "Center" { label: "Central Idea", width: 240, x: 300, y: 100 };

/* Cluster 1 */
Node "C1A" { label: "Cluster 1 - A", width: 200, x: 50, y: 300 };
Node "C1B" { label: "Cluster 1 - B", width: 200, x: -150, y: 450 };
Node "C1C" { label: "Cluster 1 - C", width: 200, x: 250, y: 450 };

/* Connections */
Connection "Center_C1A" { source: "Center", target: "C1A" };
Connection "C1A_C1B" { source: "C1A", target: "C1B" };
Connection "C1A_C1C" { source: "C1A", target: "C1C" };`}
                </pre>
              </div>

              <img
                src="/images/Cluster-mindmap.png"
                alt="Cluster mindmap"
                className="w-full max-w-full h-auto mt-4 rounded-lg border object-contain"
              />
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                4. Radial Mindmap Template
              </h2>

              <p className="text-muted-foreground mb-4">
                A circular mindmap radiating outward from the center. Great for brainstorming or topic summaries.
              </p>

              <div className="bg-muted p-4 rounded-lg border text-sm overflow-x-auto w-full">
                <pre className="whitespace-pre-wrap break-words">
{`Node "Core" { label: "Central Topic", width: 240, x: 300, y: 300 };
Node "R1A" { label: "Idea A", width: 180, x: 300, y: 50 };
Node "R1B" { label: "Idea B", width: 180, x: 550, y: 200 };
Connection "Core_R1A" { source: "Core", target: "R1A" };
Connection "Core_R1B" { source: "Core", target: "R1B" };`}
                </pre>
              </div>

              <img
                src="/images/Radial-mindmap.png"
                alt="Radial mindmap"
                className="w-full max-w-full h-auto mt-4 rounded-lg border object-contain"
              />
            </section>

          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}
