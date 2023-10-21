/**
 * mobile/src/components/E2FindProjectsCalendar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2023
 *
 */

import * as React from "react";
import Calendar from "./calendar/Calendar";

export default function E2FindProjectsCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState<number>(
    new Date().getUTCMonth(),
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    new Date().getUTCFullYear(),
  );

  const [datesWithEvents, setDatesWithEvents] = React.useState<number[]>([]);

  return (
    <>
      <Calendar
        month={currentMonth}
        year={currentYear}
        onDayClick={(d) => {
          alert(d);
        }}
        datesWithEvents={datesWithEvents}
      />
    </>
  );
}
