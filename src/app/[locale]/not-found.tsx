import { getTranslations } from "next-intl/server";
import { ButtonLink, Container, Heading, Lead } from "@/components/site";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <main id="main" className="flex flex-1 items-center py-(--spacing-section)">
      <Container width="prose" className="space-y-6">
        <Heading as="h1">{t("title")}</Heading>
        <Lead>{t("body")}</Lead>
        <ButtonLink href="/">{t("backHome")}</ButtonLink>
      </Container>
    </main>
  );
}
