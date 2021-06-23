export * from "./colors";
export * from "./interfaces";
export * from "./typescripts";

export const HARD_SHADOW = {
  borderWidth: 1,
  borderColor: "black",
  shadowColor: "#000",
  shadowOpacity: 0.9,
  shadowOffset: { width: 10, height: 10 },
  shadowRadius: 0,
};

export const NETWORKS = ["ORANGE", "MTN", "MOOV"];

export const KEYWORDS = [
  { value: "fullName", label: "@nom_complet_du_client" },
  { value: "lastName", label: "@nom_de_famille_du_client" },
  { value: "firstName", label: "@prenom_du_client" },
  { value: "email", label: "@email_du_client" },
  { value: "number", label: "@numero_du_client" },
];
