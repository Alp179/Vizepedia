import { useContext } from "react";
import { UserSelectionsContext } from "../../context/UserSelectionsContext";

function useUserSelections() {
  const context = useContext(UserSelectionsContext);
  if (context === undefined) {
    throw new Error(
      "useUserSelections must be used within a UserSelectionsProvider"
    );
  }
  return context;
}
export { useUserSelections };
