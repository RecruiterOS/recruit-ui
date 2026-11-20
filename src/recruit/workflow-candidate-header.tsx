"use client";

import { Image } from "@epicbagel/saas-kit/primitives/image";
import { PersonAvatar } from "@epicbagel/saas-kit/primitives/person-avatar";
import { Text } from "@epicbagel/saas-kit/primitives/text";
import { useState, type ReactNode } from "react";
import { CandidateProfileHeader } from "./candidate-profile";

/** Profile media returned with a candidate. Missing images use the kit fallbacks. */
export interface WorkflowCandidateMedia {
  photoUrl?: string | null;
  bannerUrl?: string | null;
}

export function WorkflowCandidateHeader({ name, media, role, eyebrow }: {
  name: string;
  media: WorkflowCandidateMedia;
  role?: string;
  eyebrow?: ReactNode;
}) {
  const [failedBanner, setFailedBanner] = useState<string>();
  const banner = media.bannerUrl;
  const cover = banner && banner !== failedBanner
    ? <Image src={banner} alt="" fit="cover" onError={() => setFailedBanner(banner)} />
    : undefined;

  return <CandidateProfileHeader
    name={name}
    avatar={<PersonAvatar name={name} photoUrl={media.photoUrl} size={48} decorative />}
    cover={cover}
    coverSize="compact"
    titleLevel={3}
    eyebrow={eyebrow}
    meta={role && <Text size="sm" tone="muted">{role}</Text>}
  />;
}
