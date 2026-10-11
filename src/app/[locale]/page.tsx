import { getTranslations } from "next-intl/server";
import { Container, Heading, Lead } from "@/components/site";

// Temporary page, replaced by the real home page in milestone 2.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Placeholder" });
  return (
    <main id="main" className="flex flex-1 items-center py-(--spacing-section)">
      <Container width="prose" className="space-y-4">
        <Heading as="h1">{t("title")}</Heading>
        <Lead>{t("body")}</Lead>
      </Container>
    </main>
  );
}
