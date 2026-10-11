import { getTranslations } from "next-intl/server";
import { Container, Heading, Text } from "@/components/site";

export default async function AdminHome() {
  const t = await getTranslations({ locale: "en", namespace: "Admin" });
  return (
    <main className="py-16">
      <Container className="space-y-3">
        <Heading as="h1">{t("placeholderTitle")}</Heading>
        <Text>{t("placeholderBody")}</Text>
      </Container>
    </main>
  );
}
