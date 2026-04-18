import GateEntryList from "./gate-entry/GateEntryList";

export default function SupervisorDashboard() {
  return (
    <div>
      <h1>Supervisor Dashboard</h1>

      {/* 🔥 IMPORTANT */}
      <GateEntryList isSupervisor={true} />
    </div>
  );
}