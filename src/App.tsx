import { AuditWorkspace } from "./components/AuditWorkspace";
import { AuditBuilderProvider } from "./context/AuditBuilderContext";

export default function App() {
  return (
    <AuditBuilderProvider>
      <AuditWorkspace />
    </AuditBuilderProvider>
  );
}
