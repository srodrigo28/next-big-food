import { AllergyType } from "@prisma/client";

export const ALLERGY_LABELS: Record<AllergyType, string> = {
  LACTOSE: "Lactose",
  GLUTEN: "Glúten",
  PEANUT: "Amendoim",
  NUTS: "Castanhas",
  EGG: "Ovo",
  SOY: "Soja",
  FISH: "Peixe",
  SHELLFISH: "Frutos do mar",
  COLORANTS: "Corantes",
  OTHER: "Outro",
};
