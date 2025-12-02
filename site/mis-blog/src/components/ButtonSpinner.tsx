import { ScaleLoader } from "react-spinners";

// Shared spinner for all action buttons (login, save, create, etc.)
// Thin, slightly tall black lines to match the Sign In button feel.
export const ButtonSpinner: React.FC = () => (
  <ScaleLoader color="#000000" height={18} width={2} radius={2} margin={1} />
);
