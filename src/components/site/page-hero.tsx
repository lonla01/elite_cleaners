import type { ImageRef } from "@/content/schemas";
import { Container } from "./container";
import { ContentImage } from "./content-image";
import { Eyebrow, Heading, Lead } from "./typography";

type Props = { eyebrow?: string; title: string; intro?: string; image: ImageRef };

/** Interior page hero: text on ivory, wide image below. */
export function PageHero({ eyebrow, title, intro, image }: Props) {
  return (
    <section className="pt-16 sm:pt-24">
      <Container className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="space-y-6 lg:col-span-7">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Heading as="h1" size="display">
            {title}
          </Heading>
        </div>
        {intro && <Lead className="lg:col-span-5">{intro}</Lead>}
      </Container>
      <Container className="mt-12 sm:mt-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm sm:aspect-[2/1]">
          <ContentImage image={image} fill preload sizes="(min-width: 76rem) 76rem, 100vw" />
        </div>
      </Container>
    </section>
  );
}
