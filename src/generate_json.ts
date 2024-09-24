import { join } from "https://deno.land/std@0.222.1/path/mod.ts";

const generateCalendar = () => {
  const calendar: { [key: string]: string | null } = {};
  Deno.readTextFileSync("./csv/calendar.csv")
    .split("\n")
    .map((item) => item.split(","))
    .forEach(
      (item) => (calendar[item[0]] = item[1] !== "null" ? item[1] : null),
    );
  return calendar;
};

const listSubDirName = (path: string) => {
  const list = [];

  for (const item of Deno.readDirSync(path)) {
    if (item.isDirectory) {
      list.push(item.name);
    }
  }

  return list;
};

interface BusTimetable {
  time: string;
  destination: string;
  isRushHour: boolean;
}

interface TrainTimetable {
  time: string;
  track: string;
  destination: string;
}

const generateBusTimetable = (path: string): BusTimetable[] => {
  return Deno.readTextFileSync(path)
    .split("\n")
    .map((item) => item.split(","))
    .flatMap((values) => {
      return {
        time: values[0],
        destination: values[1],
        isRushHour: values[2] === "true",
      };
    });
};

const generateTrainTimetable = (path: string): TrainTimetable[] => {
  return Deno.readTextFileSync(path)
    .split("\n")
    .map((item) => item.split(","))
    .flatMap((values) => {
      return {
        time: values[0],
        track: values[1],
        destination: values[2],
      };
    });
};

const generateTimesheet = () => {
  const timesheet: {
    [key: string]: {
      busLeft: BusTimetable[];
      busRight: BusTimetable[];
      trainLeft: TrainTimetable[];
      trainRight: TrainTimetable[];
    };
  } = {};
  listSubDirName("./csv/").forEach((id) => {
    timesheet[id] = {
      busLeft: generateBusTimetable(join("csv", id, "bus_left.csv")),
      busRight: generateBusTimetable(join("csv", id, "bus_right.csv")),
      trainLeft: generateTrainTimetable(join("csv", id, "train_left.csv")),
      trainRight: generateTrainTimetable(join("csv", id, "train_right.csv")),
    };
  });

  return timesheet;
};

const busData = JSON.stringify({
  lastmod: new Date().toISOString(),
  calendar: generateCalendar(),
  timesheet: generateTimesheet(),
});

const encoder = new TextEncoder();
const contentBytes = encoder.encode(busData);
Deno.writeFileSync("./csv/busData.json", contentBytes);
console.log("[Write] ./csv/busData.json");

// deno run --allow-write --allow-read src/generate_json.ts
