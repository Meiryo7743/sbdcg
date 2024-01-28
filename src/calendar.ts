import { Calendar } from "./bus_data.d.ts";

export const calendarTable = (calendar: Calendar) => {
  const list = calendar.list;
  return list.flatMap((item) => {
    const year = calendar.year;
    const month = calendar.month.padStart(2, "0");
    const day = item.day.padStart(2, "0");
    const date = `${year}-${month}-${day}`;
    const timesheetId = item.ts_id !== "none" ? item.ts_id : "null";
    return [date, timesheetId].join(",");
  });
};
