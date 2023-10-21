/**
 * mobile/src/components/calendar/Calendar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2023
 *
 */

import * as React from "react";
import "../../theme/calendar.scss";
import moment from "moment";
import { useEffect } from "react";

export default function Calendar(props: {
  month: number;
  year: number;
  onDayClick: (day: number) => void;
  datesWithEvents: number[];
}) {
  const [calModel, setCalModel] = React.useState<{
    weeks: {
      startsAt: number;
      endsAt: number;
      days: {
        day: number;
        isToday: boolean;
        isFuture: boolean;
        isPast: boolean;
        isEvent: boolean;
        isOtherMonth: boolean;
      }[];
    }[];
  }>({ weeks: [] });

  useEffect(() => {
    let weeks: typeof calModel.weeks = [];

    const startWeekNumber =
      moment().year(props.year).month(props.month).startOf("month").week() - 1;
    const endWeekNumber =
      moment().year(props.year).month(props.month).endOf("month").week() + 1;

    console.log(startWeekNumber, endWeekNumber);

    for (
      let weekNum = startWeekNumber;
      weekNum <
      (endWeekNumber < startWeekNumber ? endWeekNumber + 52 : endWeekNumber);
      weekNum++
    ) {
      for (let dayNum = 1; dayNum <= 7; dayNum++) {
        const day = moment()
          .year(props.year)
          .month(props.month)
          .week(weekNum)
          .day(dayNum);
        const isToday = day.isSame(moment(), "day");
        const isFuture = day.isAfter(moment(), "day");
        const isPast = day.isBefore(moment(), "day");
        const isEvent = props.datesWithEvents.includes(day.date());
        const isOtherMonth = day.month() !== props.month;

        if (weeks[weekNum - startWeekNumber] === undefined) {
          weeks[weekNum - startWeekNumber] = {
            startsAt: day.date(),
            endsAt: day.date(),
            days: [],
          };
        } else {
          weeks[weekNum - startWeekNumber].endsAt = day.date();
        }

        weeks[weekNum - startWeekNumber].days.push({
          day: day.date(),
          isToday,
          isFuture,
          isPast,
          isEvent,
          isOtherMonth,
        });
      }
    }

    setCalModel({ weeks });
  }, [props.year, props.month, props.datesWithEvents]);

  return (
    <>
      <div className={"cal-container"}>
        <div className={"cal-grid"}>
          <div className={"cal-grid-row cal-grid-header"}>
            <div className={"cal-grid-item cal-grid-header-item"}>Mo</div>
            <div className={"cal-grid-item cal-grid-header-item"}>Di</div>
            <div className={"cal-grid-item cal-grid-header-item"}>Mi</div>
            <div className={"cal-grid-item cal-grid-header-item"}>Do</div>
            <div className={"cal-grid-item cal-grid-header-item"}>Fr</div>
            <div className={"cal-grid-item cal-grid-header-item"}>Sa</div>
            <div className={"cal-grid-item cal-grid-header-item"}>So</div>
          </div>
          {calModel.weeks.map((week, i) => {
            return (
              <>
                <div className={"cal-grid-row"}>
                  {week.days.map((day, i) => {
                    return (
                      <div
                        className={`cal-grid-item ${
                          day.isToday ? "cal-grid-item-today" : ""
                        } ${day.isFuture ? "cal-grid-item-future" : ""} ${
                          day.isPast ? "cal-grid-item-past" : ""
                        } ${day.isEvent ? "cal-grid-item-event" : ""} ${
                          day.isOtherMonth ? "cal-grid-item-other-month" : ""
                        }`}
                        onClick={() => {
                          if (!day.isOtherMonth && !day.isPast) {
                            props.onDayClick(day.day);
                          }
                        }}
                      >
                        {day.day}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
