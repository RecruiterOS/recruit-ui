"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@epicbagel/saas-kit/primitives/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@epicbagel/saas-kit/primitives/dialog";
import { Item, ItemGroup, ItemContent, ItemMedia, ItemTitle, ItemDescription } from "@epicbagel/saas-kit/primitives/item";
import { PersonAvatar } from "@epicbagel/saas-kit/primitives/person-avatar";
import { RecordReviewCard, type CandidateReviewFact, type CandidateReviewCardProps } from "./candidate-review-card";

export interface ProspectMatch {
  id: string;
  name: string;
  evidence: string;
  photoUrl?: string;
}

export interface ClientProspectCardProps {
  company: string;
  logo?: ReactNode;
  role: ReactNode;
  facts: readonly CandidateReviewFact[];
  signal: ReactNode;
  matches: readonly ProspectMatch[];
  actions?: ReactNode;
  empty?: ReactNode;
}

/** The opening, the relationship and the people a recruiter could introduce. */
export function ClientProspectCard({ company, logo, role, facts, signal, matches, actions, empty }: ClientProspectCardProps) {
  return <RecordReviewCard data-slot="client-prospect-card" name={company} headline={role} avatar={logo} cover={null}
    facts={facts} insight={{ label: "Why now", value: signal }} actions={
      <section className="grid gap-3 px-4 py-4 sm:px-6" aria-label="Rolodex matches">
        <h4 className="text-sm font-semibold">From your Rolodex</h4>
        {matches.length ? <ItemGroup>{matches.map(p => <Item key={p.id} size="sm" className="items-start rounded-none border-0 px-0 py-3 [&+&]:border-t">
          <ItemMedia><PersonAvatar name={p.name} photoUrl={p.photoUrl} size={36} decorative /></ItemMedia>
          <ItemContent><ItemTitle>{p.name}</ItemTitle><ItemDescription className="line-clamp-none">{p.evidence}</ItemDescription></ItemContent>
        </Item>)}</ItemGroup> : empty}
        {actions}
      </section>
    } />;
}

export interface ShortlistPreviewCardProps extends Pick<CandidateReviewCardProps, "headline" | "avatar" | "facts" | "insight" | "headerActions"> {
  name: string;
  preview: ReactNode;
  previewTitle?: string;
  openLabel?: string;
}

/** Public shortlist entry. The host supplies only information available to this reader. */
export function ShortlistPreviewCard({ name, preview, previewTitle = name, openLabel = "View profile", ...card }: ShortlistPreviewCardProps) {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <RecordReviewCard {...card} data-slot="shortlist-preview-card" name={name} cover={null} onSelect={() => setOpen(true)} selectLabel={"Open preview for " + name}
      actions={<div className="px-4 sm:px-6"><DialogTrigger asChild><Button type="button" variant="outline" aria-label={openLabel + ": " + name}>{openLabel}</Button></DialogTrigger></div>} />
    <DialogContent aria-describedby={undefined} className="max-h-[85dvh] overflow-y-auto">
      <DialogTitle>{previewTitle}</DialogTitle>
      {preview}
    </DialogContent>
  </Dialog>;
}
