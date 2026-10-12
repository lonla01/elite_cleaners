import type { ContentLinkData } from "@/content/schemas";
import { Container } from "./container";
import { ContentButtonLink } from "./content-link";
import { Heading, Lead } from "./typography";
import { Section } from "./section";

type Props = {
  title: string;
  body: string;
  primary: ContentLinkData;
  secondary?: ContentLinkData;
};

export function CtaBand({ title, body, primary, secondary }: Props) {
  return (
    <Section tone="navy">
      <Container className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-(--container-prose) space-y-5">
          <Heading>{title}</Heading>
          <Lead>{body}</Lead>
        </div>
        <div className="flex flex-wrap gap-4">
          <ContentButtonLink link={primary} variant="light" size="lg" />
          {secondary && <ContentButtonLink link={secondary} variant="outline" size="lg" />}
        </div>
      </Container>
    </Section>
  );
}
