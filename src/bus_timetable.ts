import { BusDirection, List } from "./bus_data.d.ts";

export const busRushHoursTimetable = (list: List[], direction: BusDirection) =>
  list
    .filter(
      (item) => item[direction].memo1 !== "" || item[direction].memo2 !== ""
    )
    .flatMap((item) => {
      const hour = item.time.padStart(2, "0");
      return [item[direction].memo1, item[direction].memo2]
        .filter((memo) => memo !== "")
        .map((memo) => {
          if (/^(?:間隔を狭めて|適時)運行$/.test(memo)) {
            return Array(60)
              .fill(0)
              .flatMap((_, i) => `${i}`.padStart(2, "0"))
              .map((minute) => `${hour}:${minute}:00`);
          }

          if (
            /^[0-9]{1,2}:[0-9]{1,2}まで(?:間隔を狭めて|適時)運行$/.test(memo)
          ) {
            const endMinute = Number(
              memo.replace(
                /^[0-9]{1,2}:([0-9]{1,2})まで(?:間隔を狭めて|適時)運行$/,
                "$1"
              )
            );
            const length = endMinute + 1;
            return Array(length)
              .fill(0)
              .flatMap((_, i) => `${i}`.padStart(2, "0"))
              .map((minute) => `${hour}:${minute}:00`);
          }

          if (
            /^[0-9]{1,2}:[0-9]{1,2}より(?:間隔を狭めて|適時)運行$/.test(memo)
          ) {
            const startMinute = Number(
              memo.replace(
                /^[0-9]{1,2}:([0-9]{1,2})より(?:間隔を狭めて|適時)運行$/,
                "$1"
              )
            );
            const length = 60 - startMinute;
            return Array(length)
              .fill(0)
              .flatMap((_, i) => `${startMinute + i}`.padStart(2, "0"))
              .map((minute) => `${hour}:${minute}:00`);
          }

          if (
            /^[0-9]{1,2}:[0-9]{1,2}より[0-9]{1,2}:[0-9]{1,2}まで(?:間隔を狭めて|適時)運行$/.test(
              memo
            )
          ) {
            const minuteList = memo
              .replace(
                /^[0-9]{1,2}:([0-9]{1,2})より[0-9]{1,2}:([0-9]{1,2})まで(?:間隔を狭めて|適時)運行$/,
                "$1,$2"
              )
              .split(",")
              .map((minute) => Number(minute));
            const startMinute = minuteList[0];
            const endMinute = minuteList[1];
            const length = endMinute + 1 - startMinute;
            return Array(length)
              .fill(0)
              .flatMap((_, i) => `${startMinute + i}`.padStart(2, "0"))
              .map((minute) => `${hour}:${minute}:00`);
          }
        });
    })
    .flatMap((item) => item)
    .map((time) =>
      [
        time,
        direction === "bus_left" ? "大宮キャンパス" : "東大宮駅",
        true,
      ].join(",")
    );

export const busTimetable = (list: List[], direction: BusDirection) =>
  list
    .flatMap((item) => {
      const hour = item.time.padStart(2, "0");
      return [
        ...item[direction].num1
          .split(".")
          .filter((s) => s !== "")
          .map((m) => m.padStart(2, "0")),
        ...item[direction].num2
          .split(".")
          .filter((s) => s !== "")
          .map((m) => m.padStart(2, "0")),
      ].map((minute) => `${hour}:${minute}:00`);
    })
    .map((time) =>
      [
        time,
        direction === "bus_left" ? "大宮キャンパス" : "東大宮駅",
        false,
      ].join(",")
    );
