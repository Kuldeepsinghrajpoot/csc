import { LucideIcon } from "lucide-react";

export interface GovernmentPortal {
  id: number;
  name: string;
  description: string;
  category:
    | "Identity"
    | "Finance"
    | "Health"
    | "Education"
    | "Agriculture"
    | "Transport"
    | "Employment"
    | "Business"
    | "Utility"
    | "Digital India";

  website: string;
  icon: LucideIcon;
  color: string;
  featured?: boolean;
}