import { List, SiteInfo, TrainDirection } from "./bus_data.d.ts";

const findDestination = (
  siteInfo: SiteInfo,
  mark: string,
  direction: TrainDirection,
) => {
  return siteInfo.will[direction === "train_left" ? "down" : "up"].filter(
    (destination) =>
      mark === "" ? destination.mark === "default" : destination.mark === mark,
  )[0].tip;
};

export const trainTimetable = (
  list: List[],
  direction: TrainDirection,
  siteInfo: SiteInfo,
) =>
  list
    .flatMap((item) => {
      const hour = item.time.padStart(2, "0");
      return [
        ...item[direction].num1.split(".").filter((s) => s !== ""),
        ...item[direction].num2.split(".").filter((s) => s !== ""),
      ]
        .map((s) => s.replace(/^([a-z]*)([0-9]+)[◆■]*$/, `$1,$2`).split(","))
        .map((item) => {
          const [mark, minute] = item;
          return [mark, `${hour}:${minute.padStart(2, "0")}:00`];
        })
        .map((item) => {
          const [mark, time] = item;
          const track = direction === "train_left" ? "1" : "2";
          return [time, track, findDestination(siteInfo, mark, direction)].join(
            ",",
          );
        });
    })
    .join("\n");
