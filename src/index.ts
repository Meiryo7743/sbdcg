import type {
  BusDirection,
  Calendar,
  Root,
  Timesheet,
  TrainDirection,
} from "./bus_data.d.ts";
import { busRushHoursTimetable, busTimetable } from "./bus_timetable.ts";
import { trainTimetable } from "./train_timetable.ts";
import { calendarTable } from "./calendar.ts";

// Fetch
const response = await fetch("http://bus.shibaura-it.ac.jp/db/bus_data.json");
const busData: Root = await response.json();

// フォルダを作成する
const timesheetList: Timesheet[] = busData.timesheet;
timesheetList.forEach((timesheet) => {
  const id = timesheet.ts_id;
  Deno.mkdir(`./csv/${id}`, { recursive: true });
  console.log(`[Create] ./csv/${id}`);
});

// バス時刻表を生成する
const busDirectionList: BusDirection[] = ["bus_left", "bus_right"];
timesheetList.forEach((timesheet) => {
  const id = timesheet.ts_id;
  const list = timesheet.list;
  busDirectionList.forEach((direction) => {
    const timetable = [
      busTimetable(list, direction),
      busRushHoursTimetable(list, direction),
    ]
      .flat()
      .sort()
      .join("\n");
    const encoder = new TextEncoder();
    const contentBytes = encoder.encode(timetable);
    Deno.writeFileSync(`./csv/${id}/${direction}.csv`, contentBytes);
    console.log(`[Write] ./csv/${id}/${direction}.csv`);
  });
});

// 電車時刻表を生成する
const trainDirectionList: TrainDirection[] = ["train_left", "train_right"];
const siteInfo = busData.site_info[0];
timesheetList.forEach((timesheet) => {
  const id = timesheet.ts_id;
  const list = timesheet.list;
  trainDirectionList.forEach((direction) => {
    const timetable = trainTimetable(list, direction, siteInfo);
    const encoder = new TextEncoder();
    const contentBytes = encoder.encode(timetable);
    Deno.writeFileSync(`./csv/${id}/${direction}.csv`, contentBytes);
    console.log(`[Write] ./csv/${id}/${direction}.csv`);
  });
});

// カレンダー
const calendarList: Calendar[] = busData.calendar;
const table = calendarList
  .flatMap((calendar) => {
    return calendarTable(calendar);
  })
  .sort()
  .join("\n");
const encoder = new TextEncoder();
const contentBytes = encoder.encode(table);
Deno.writeFileSync("./csv/calendar.csv", contentBytes);
console.log("[Write] ./csv/calendar.csv");
