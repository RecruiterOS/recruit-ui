"use client";

import { ResourceCard } from "@epicbagel/saas-kit/primitives/resource-card";
import { CandidatePipelineList, type CandidatePipelineListProps } from "./candidate-pipeline-list";
import { WorkflowCandidateHeader, type WorkflowCandidateMedia } from "./workflow-candidate-header";

export function ApplicationPipelineBlock<TStage extends string = string>({
  profile, ...list
}: CandidatePipelineListProps<TStage> & { profile?: WorkflowCandidateMedia & { name: string } }) {
  if (!profile) return <CandidatePipelineList {...list} />;
  return <ResourceCard className="@container/application">
    <WorkflowCandidateHeader name={profile.name} media={profile} />
    <CandidatePipelineList {...list} />
  </ResourceCard>;
}
