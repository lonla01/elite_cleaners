import {
  Award,
  Building2,
  Calendar,
  Check,
  ClipboardList,
  HeartHandshake,
  Home,
  KeyRound,
  Leaf,
  Lock,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  UserCheck,
  Users,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/schemas";

const icons = {
  shield: Shield,
  "user-check": UserCheck,
  award: Award,
  leaf: Leaf,
  lock: Lock,
  calendar: Calendar,
  key: KeyRound,
  sparkles: Sparkles,
  users: Users,
  "heart-handshake": HeartHandshake,
  building: Building2,
  home: Home,
  clipboard: ClipboardList,
  message: MessageCircle,
  check: Check,
  star: Star,
} satisfies Record<IconName, unknown>;

/** Content icons are decorative: their meaning is always carried by adjacent text. */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name];
  return <Component aria-hidden strokeWidth={1.25} {...props} />;
}
