const NurseSchedule = () => {
  // Eventually: Fetch real shift data via API!
  const shifts = [
    { day: "Monday", start: "08:00", end: "16:00" },
    { day: "Wednesday", start: "12:00", end: "20:00" },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">My Shifts This Week</h2>
      <table className="min-w-full bg-gray-800 rounded-xl">
        <thead>
          <tr>
            <th className="p-4 text-left text-gray-400">Day</th>
            <th className="p-4 text-left text-gray-400">Start</th>
            <th className="p-4 text-left text-gray-400">End</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, idx) => (
            <tr key={idx}>
              <td className="p-4 text-white">{shift.day}</td>
              <td className="p-4 text-white">{shift.start}</td>
              <td className="p-4 text-white">{shift.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-gray-400 pt-4 text-sm">
        (This will show your assigned shifts and on-duty times for the week.)
      </div>
    </div>
  );
};
export default NurseSchedule;
