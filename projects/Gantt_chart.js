/////////////////////// Начинаем работу над Gantt chart. Нужно перевести даты в недели - выбранные отметки для строителей

/**
 * Получает номер недели года (ISO неделя, первый день - понедельник)
 * @param {string} dateStr - дата в формате 'YYYY-MM-DD'
 * @returns {number} - номер недели (1-53)
 */

function getWeekNumber(dateStr) {
  const date = new Date(dateStr);
  // Копируем дату и устанавливаем на понедельник текущей недели
  const tempDate = new Date(date);
  const dayOfWeek = tempDate.getDay(); // 0=воскресенье, 1=понедельник, ...

  // Вычисляем смещение до понедельника (1 - день недели)
  // Если день недели = 0 (воскресенье), то смещение = -6 (воскресенье -> понедельник)
  const diff = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek;
  tempDate.setDate(tempDate.getDate() + diff);

  // Получаем год
  const year = tempDate.getFullYear();
  // Получаем 1 января года
  const jan1 = new Date(year, 0, 1);
  const jan1DayOfWeek = jan1.getDay(); // 0=воскресенье, 1=понедельник, ...

  // Вычисляем номер недели
  const daysToFirstMonday = (jan1DayOfWeek === 0) ? 1 : 8 - jan1DayOfWeek;
  const firstMonday = new Date(year, 0, daysToFirstMonday);

  // Если первый понедельник в следующем году
  if (firstMonday.getFullYear() > year) {
    return 1;
  }

  // Вычисляем разницу в днях между текущей датой и первым понедельником
  const diffDays = Math.floor((tempDate - firstMonday) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return weekNumber;

}


/**
 * Получает неделю и год для даты
 * @param {string} dateStr - дата в формате 'YYYY-MM-DD'
 * @returns {object} - { week: number, year: number }
 */

function getWeekAndYear(dateStr) {
  const date = new Date(dateStr);
  const week = getWeekNumber(dateStr);

  // Определяем год недели (может отличаться от года даты)
  const tempDate = new Date(date);
  const dayOfWeek = tempDate.getDay();
  const diff = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek;
  tempDate.setDate(tempDate.getDate() + diff);
  const year = tempDate.getFullYear();

  // Проверяем, не относится ли неделя к следующему году
  if (week === 1 && tempDate.getMonth() === 11 && tempDate.getDate() > 25) {
    return { week: week, year: year + 1 };
  }

  // Проверяем, не относится ли неделя к предыдущему году
  if (week > 50 && tempDate.getMonth() === 0 && tempDate.getDate() < 4) {
    return { week: week, year: year - 1 };
  }

  return { week, year };

}




/**

 * Обрабатывает данные из Gantt_chart.json

 * @param {object} data - данные из JSON

 * @returns {object} - { tasksWithWeeks, minStart, maxEnd, weekRange }

 */



function processGanttData(data) {

  const tasks = data?.chart_gantt?.tasks || [];



  if (tasks.length === 0) {

    console.warn('Нет данных для обработки');

    return {

      tasksWithWeeks: [],

      minStart: null,

      maxEnd: null,

      weekRange: 0

    };

  }



  // Добавляем номера недель к каждой задаче

  const tasksWithWeeks = tasks.map(task => {

    const startWeek = getWeekAndYear(task.start);

    const endWeek = getWeekAndYear(task.end);

    const todayWeek = getWeekAndYear(task.today);



    return {

      ...task,

      startWeek: startWeek.week,

      startYear: startWeek.year,

      endWeek: endWeek.week,

      endYear: endWeek.year,

      // Нормализованный номер недели (для расчета длительности)

      startWeekNormalized: startWeek.year * 100 + startWeek.week,

      endWeekNormalized: endWeek.year * 100 + endWeek.week

    };

  });



  // Находим минимальный start и максимальный end

  let minStart = null;

  let maxEnd = null;

  let todayDate = null;



  tasksWithWeeks.forEach(task => {

    const startDate = new Date(task.start);

    const endDate = new Date(task.end);

    const todayDate = new Date(task.today);



    if (minStart === null || startDate < minStart) {

      minStart = startDate;

    }

    if (maxEnd === null || endDate > maxEnd) {

      maxEnd = endDate;

    }

  });



  // Вычисляем диапазон недель

  const minStartWeek = getWeekAndYear(minStart ? minStart.toISOString().split('T')[0] : '');

  const maxEndWeek = getWeekAndYear(maxEnd ? maxEnd.toISOString().split('T')[0] : '');

  const mTodayWeek = getWeekAndYear(todayDate ? todayDate.toISOString().split('T')[0] : '');



  const weekRange = (maxEndWeek.year * 100 + maxEndWeek.week) -

    (minStartWeek.year * 100 + minStartWeek.week) + 1;



  return {

    tasksWithWeeks,

    minStart,

    maxEnd,

    minStartWeek,

    maxEndWeek,

    weekRange,

    mTodayWeek

  };

}




///// processGanttData завершение функции

///// добавляем функцию для фильтров

// let ganttSourceData = null;

let originalGanttData = null;



const executorFilter = document.getElementById("executor-filter");

const unitFilter = document.getElementById("unit-filter");

const taskFilter = document.getElementById("task-filter");

const resetFiltersButton = document.getElementById("reset-gantt-filters");

const filterInfo = document.getElementById("gantt-filter-info");



async function loadGanttData() {

  const response = await fetch("./Gantt_chart.json");



  if (!response.ok) {

    throw new Error(`Cannot load Gantt_chart.json: ${response.status}`);

  }



  originalGanttData = await response.json();



  populateExecutorFilter();

  populateUnitFilter();

  applyGanttFilters();

}



function getOriginalTasks() {

  return originalGanttData?.chart_gantt?.tasks || [];

}



function populateExecutorFilter() {

  const executors = [...new Set(

    getOriginalTasks()

      .map(task => String(task.executor || "").trim())

      .filter(Boolean)

  )].sort((a, b) => a.localeCompare(b, "ru"));



  executorFilter.innerHTML = `

    <option value="">Все исполнители</option>

  `;



  executors.forEach(executor => {

    const option = document.createElement("option");

    option.value = executor;

    option.textContent = executor;

    executorFilter.appendChild(option);

  });

}



function populateUnitFilter() {

  const units = [...new Set(

    getOriginalTasks()

      .map(task => String(task.unit || "").trim())

      .filter(Boolean)

  )].sort((a, b) => a.localeCompare(b, "ru"));



  unitFilter.innerHTML = `

    <option value="">Все единицы измерения</option>

  `;



  units.forEach(unit => {

    const option = document.createElement("option");

    option.value = unit;

    option.textContent = unit;

    unitFilter.appendChild(option);

  });

}



function getTasksArray(data) {

  return Array.isArray(data) ? data : (data?.chart_gantt?.tasks || []);

}



function applyGanttFilters() {

  if (!originalGanttData) return;



  const selectedExecutor = executorFilter.value

    .trim()

    .toLocaleLowerCase("ru");



  const selectedUnit = unitFilter.value

    .trim()

    .toLocaleLowerCase("ru");



  const taskSearch = taskFilter.value

    .trim()

    .toLocaleLowerCase("ru");



  const allTasks = getOriginalTasks();



  const filteredTasks = allTasks.filter(task => {

    const executor = String(task.executor || "")

      .trim()

      .toLocaleLowerCase("ru");



    const unit = String(task.unit || "")

      .trim()

      .toLocaleLowerCase("ru");



    const taskName = String(task.task || "")

      .trim()

      .toLocaleLowerCase("ru");



    const executorMatches =

      selectedExecutor === "" || executor === selectedExecutor;



    const unitMatches =

      selectedUnit === "" || unit === selectedUnit;



    const taskMatches =

      taskSearch === "" || taskName.includes(taskSearch);



    return executorMatches && unitMatches && taskMatches;

  });



  // критично: сохранить иерархию JSON файла для processGanttData().

  const filteredData = {

    ...originalGanttData,

    chart_gantt: {

      ...originalGanttData.chart_gantt,

      tasks: filteredTasks

    }

  };



  renderGanttChart(filteredData);



  if (filterInfo) {

    filterInfo.textContent =

      `Показано: ${filteredTasks.length} из ${allTasks.length}`;

  }

}



executorFilter.addEventListener("change", applyGanttFilters);



unitFilter.addEventListener("change", applyGanttFilters);



taskFilter.addEventListener("input", applyGanttFilters);



resetFiltersButton.addEventListener("click", () => {

  executorFilter.value = "";

  unitFilter.value = "";

  taskFilter.value = "";

  applyGanttFilters();

});




loadGanttData().catch(error => console.error("Gantt load error:", error));



//// окончание вставки для фильтров



function exportGanttDataToCSV(result) {

  const gantt_data = processGanttData(result);

  const rows = result.gantt_data.map(function (t) {

    return {

      task: t.task,

      executor: t.executor,

      minStart: t.minStart,

      maxEnd: t.maxEnd,

      minStartWeek: t.minStartWeek,

      maxEndWeek: t.maxEndWeek

    };

  });



  if (rows.length === 0) {

    console.warn("No rows to export");

    return;

  }



  const headers = Object.keys(rows[0]);

  const csvLines = [headers.join(",")];



  rows.forEach(function (r) {

    const line = headers

      .map(function (h) {

        const val = r[h] !== undefined && r[h] !== null ? r[h] : "";

        return '"' + String(val).replace(/"/g, '""') + '"';

      })

      .join(",");

    csvLines.push(line);

  });



  const csv = csvLines.join("\n");



  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "gantt_debug.csv";

  a.click();

  URL.revokeObjectURL(url);

}



function exportGanttResultToJSON(result) {

  const json = JSON.stringify(result, null, 2);

  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "gantt_result.json";

  a.click();

  URL.revokeObjectURL(url);



}

// ---------- ФУНКЦИЯ ДЛЯ ОТРИСОВКИ ГАНТА (горизонтальный) ----------

///////////////////////////////////////////////////////////////////////////////////////



function renderGanttChart(data) {

  const result = processGanttData(data);

  // exportGanttDataToCSV(result);

  // exportGanttResultToJSON(result)

  const tasks = result.tasksWithWeeks;

  const minStart = result.minStart;

  const maxEnd = result.maxEnd;

  // const todayDate=result.todayDate;



  const ns = "http://www.w3.org/2000/svg";



  if (tasks.length === 0) {

    console.warn('Нет данных для отрисовки');

    return;

  }



  const svg = document.getElementById("gantt-chart");

  // const containerWidth=svg.parentElement.clientWidth||1400;



  //1. Настройка отступов для колонок

  const paddingLeft = 200;

  const paddingRight = 50;

  const paddingTop = 60;

  const paddingBottom = 40;



  //2.  Настройка колонок

  const col0X = paddingLeft - 10;        // Номер

  const col1X = paddingLeft + 30;        // Название задачи

  const col2X = paddingLeft + 160;       // Исполнитель

  const col3X = paddingLeft + 250;       // План

  const col4X = paddingLeft + 320;       // остаток

  const col5X = paddingLeft + 400;       // процент выполнения



  const columnBuffer = 100;

  const paddingLeft2 = col5X + columnBuffer;



  // определяем максимальную и минимальную неделю

  const weeks = [];

  const startWeek = result.minStartWeek;

  const endWeek = result.maxEndWeek;



  const weeksCount = (endWeek.week - startWeek.week);

  const pixelsPerWeek = 20;

  const minChartAreaWidth = Math.max(800, weeksCount * pixelsPerWeek);

  const width = paddingLeft2 + minChartAreaWidth + paddingRight;

  const height = Math.max(200, tasks.length * 45 + 60);

  // const fontSizeLabel = clamp(Math.min(width, height) * 0.045, 9, 14);

  // const width=Math.max(paddingLeft2+paddingRight+minChartAreaWidth, containerWidth)



  // const chartWidth = 960;

  const chartWidth = width - paddingLeft2 - paddingRight;

  const chartHeight = height - paddingTop - paddingBottom;



  const minDate = new Date(minStart);

  const maxDate = new Date(maxEnd);



  const todayDateDt = new Date("2024-08-15T00:00:00");



  const totalDays = Math.ceil((maxDate - minDate) / (24 * 60 * 60 * 1000));

  const barHeight = 30;

  const gap = 10;



  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  svg.setAttribute("width", width);

  svg.setAttribute("height", height);

  svg.innerHTML = "";



  // ----- ЗАГОЛОВКИ КОЛОНОК -----

  const headers = [

    { x: 0, text: "num", anchor: "start" },

    { x: 30, text: "Работы", anchor: "start" },

    { x: col2X, text: "Исполнитель", anchor: "start" },

    { x: col3X, text: "План", anchor: "start" },

    { x: col4X, text: "Остаток", anchor: "start" },

    { x: col5X, text: "Выполнение", anchor: "start" }

  ];



  headers.forEach(header => {

    const headerText = document.createElementNS(ns, "text");

    headerText.setAttribute("x", header.x);

    headerText.setAttribute("y", paddingTop - 15);

    headerText.setAttribute("text-anchor", header.anchor);

    headerText.setAttribute("class", "header-label");

    headerText.textContent = header.text;

    svg.appendChild(headerText);

  });



  // ----- ОСЬ ВРЕМЕНИ СВЕРХУ -----

  const axisTop = document.createElementNS(ns, "line");

  axisTop.setAttribute("x1", paddingLeft2);

  axisTop.setAttribute("y1", paddingTop);

  axisTop.setAttribute("x2", width - paddingRight);

  axisTop.setAttribute("y2", paddingTop);

  axisTop.setAttribute("class", "axis-line");

  svg.appendChild(axisTop);



  // ----- ВЕРТИКАЛЬНАЯ ОСЬ (слева) -----

  const axisLeft = document.createElementNS(ns, "line");

  axisLeft.setAttribute("x1", paddingLeft2);

  axisLeft.setAttribute("y1", paddingTop);

  axisLeft.setAttribute("x2", paddingLeft2);

  axisLeft.setAttribute("y2", height - paddingBottom);

  axisLeft.setAttribute("class", "axis-line");

  svg.appendChild(axisLeft);





  // ------Подписи месяцев добавляем над осью недель

  const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн',

    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];



  const months = [];

  let cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);



  while (cursor <= maxDate) {

    const monthStart = cursor < minDate ? minDate : cursor;

    const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);

    const monthEnd = nextMonth > maxDate ? maxDate : new Date(nextMonth - 1);



    months.push({

      start: monthStart,

      end: monthEnd,

      boundaryStart: cursor,

      label: `${monthNames[cursor.getMonth()]} ${cursor.getFullYear()}`

    });



    cursor = nextMonth;

  }



  months.forEach((m, i) => {

    const startOffset = Math.floor((m.start - minDate) / (24 * 60 * 60 * 1000));

    const endOffset = Math.floor((m.end - minDate) / (24 * 60 * 60 * 1000)) + 1;

    const xStart = paddingLeft2 + (startOffset / totalDays) * chartWidth;

    const xEnd = paddingLeft2 + (endOffset / totalDays) * chartWidth;

    const xMid = (xStart + xEnd) / 2;



    const label = document.createElementNS(ns, "text");

    label.setAttribute("x", xMid);

    label.setAttribute("y", paddingTop - 35);

    label.setAttribute("text-anchor", "middle");

    label.setAttribute("class", "month-label");

    // label.setAttribute("font-size", "12");

    // label.setAttribute("font-weight", "bold");

    // label.setAttribute("fill", "white");

    label.textContent = m.label;

    // label.textContent = "test";

    svg.appendChild(label);





    if (i > 0) {

      const divider = document.createElementNS(ns, "line");

      divider.setAttribute("x1", xStart);

      divider.setAttribute("y1", paddingTop - 20);

      divider.setAttribute("x2", xStart);

      divider.setAttribute("y2", height - paddingBottom);

      divider.setAttribute("stroke", "#9ca3af");

      divider.setAttribute("stroke-width", "1.5");

      svg.appendChild(divider);

    }

  });



  ///////////////////////////////////////////////////////

  // ----- ПОДПИСИ НЕДЕЛЬ СВЕРХУ -----

  // for (let w = startWeek.week; w <= endWeek.week + 1; w++) {

  //   weeks.push(w);

  // }

  const cursorDate = new Date(minDate);



  while (cursorDate <= maxDate) {

    const wk = getWeekAndYear(cursorDate.toISOString().split('T')[0]);

    weeks.push(wk.week);

    cursorDate.setDate(cursorDate.getDate() + 7);

  }



  if (weeks[weeks.length - 1] !== result.maxEndWeek.week) {

    weeks.push(result.maxEndWeek.week);

  }



  weeks.forEach((week, i) => {

    const x = paddingLeft2 + (i / (weeks.length - 1)) * chartWidth;



    const label = document.createElementNS(ns, "text");

    label.setAttribute("x", x);

    label.setAttribute("y", paddingTop - 15);

    label.setAttribute("text-anchor", "middle");

    label.setAttribute("class", "bar-label");

    // label.setAttribute("font-size", "11");

    // label.setAttribute("fill", "#666");

    label.textContent = `${week} нед.`;

    svg.appendChild(label);



    if (i > 0) {

      const gridLine = document.createElementNS(ns, "line");

      gridLine.setAttribute("x1", x);

      gridLine.setAttribute("y1", paddingTop);

      gridLine.setAttribute("x2", x);

      gridLine.setAttribute("y2", height - paddingBottom);

      gridLine.setAttribute("class", "week-gridLine");

      svg.appendChild(gridLine);

    }

  });





  // ----- ОТРИСОВКА ЗАДАЧ -----

  tasks.forEach((task, i) => {

    const y = paddingTop + 20 + i * (barHeight + gap);



    // Вычисляем позицию на временной шкале

    const startDate = new Date(task.start);

    const endDate = new Date(task.end);

    const startOffset = Math.floor((startDate - minDate) / (24 * 60 * 60 * 1000));

    const duration = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

    const x = paddingLeft2 + (startOffset / totalDays) * chartWidth;

    const barWidth = (duration / totalDays) * chartWidth;



    // ----- Получаем unit для текущей задачи -----

    const unit = task.unit || "";



    // добавим чередующиеся строки фона

    const background_task = document.createElementNS(ns, "rect");

    const background_fill = task.sorttask % 2 === 0 ? "#F7F8FA" : "#B8C1CE";

    background_task.setAttribute("x", 0);

    background_task.setAttribute("y", y);

    background_task.setAttribute("width", col5X - 10);

    background_task.setAttribute("height", barHeight);

    background_task.setAttribute("fill", background_fill);

    background_task.setAttribute("rx", 4);

    // background_task.setAttribute("stroke", "#4CAF50");

    // background_task.setAttribute("stroke-width", "1");

    svg.appendChild(background_task);



    const progress_compl = task._proj_plan ? Math.min(task.completion, 1) : 0;

    const completeColor = progress_compl > 0.95 ? "green" : "#182633"

    // ----- 1. номер по порядку-----

    const num = document.createElementNS(ns, "text");

    num.setAttribute("x", 5);

    num.setAttribute("y", y + barHeight / 2 + 4);

    num.setAttribute("text-anchor", "start");

    num.setAttribute("class", "bar-label");

    num.textContent = task.sorttask || "0";

    svg.appendChild(num);



    // ----- 1. НАЗВАНИЕ ЗАДАЧИ -----

    const label = document.createElementNS(ns, "text");

    label.setAttribute("x", 30);

    label.setAttribute("y", y + barHeight / 2 + 4);

    label.setAttribute("text-anchor", "start");

    label.setAttribute("class", "bar-label-task");

    label.style.setProperty("--complete-color", completeColor)

    label.textContent = task.task || "—";

    svg.appendChild(label);



    // ----- 2. ИСПОЛНИТЕЛЬ -----

    const executor = document.createElementNS(ns, "text");

    executor.setAttribute("x", col2X);

    executor.setAttribute("y", y + barHeight / 2 + 4);

    executor.setAttribute("text-anchor", "start");

    executor.setAttribute("class", "bar-label-other");

    executor.style.setProperty("--complete-color", completeColor)

    executor.textContent = task.executor || "—";

    svg.appendChild(executor);



    // ----- 3. ПЛАН (_proj_plan) с unit из задачи -----

    const planValue = task._proj_plan !== undefined ? task._proj_plan : "—";

    const planText = document.createElementNS(ns, "text");

    planText.setAttribute("x", col3X);

    planText.setAttribute("y", y + barHeight / 2 + 4);

    planText.setAttribute("text-anchor", "start");

    planText.setAttribute("class", "bar-label-other");

    planText.style.setProperty("--complete-color", completeColor)

    planText.textContent = typeof planValue === 'number' ? `${planValue.toLocaleString('ru-RU')} ${unit}` : planValue;

    svg.appendChild(planText);



    // ----- 4. ОСТАТОК (_proj_rest) с unit из задачи -----

    const restValue = task._proj_rest !== undefined ? task._proj_rest : "—";

    const restText = document.createElementNS(ns, "text");

    restText.setAttribute("x", col4X);

    restText.setAttribute("y", y + barHeight / 2 + 4);

    restText.setAttribute("text-anchor", "start");

    restText.setAttribute("class", "bar-label-other");

    restText.style.setProperty("--complete-color", completeColor)

    restText.textContent = typeof restValue === 'number' ? `${restValue.toLocaleString('ru-RU')} ${unit}` : restValue;

    svg.appendChild(restText);



    // процент выполнения фон

    const compl = document.createElementNS(ns, "rect");

    compl.setAttribute("x", col5X);

    compl.setAttribute("y", y);

    compl.setAttribute("width", col5X - col4X);

    compl.setAttribute("height", barHeight);

    compl.setAttribute("rx", 4);

    compl.setAttribute("fill", "#f3f4f6");

    compl.setAttribute("stroke", "#4CAF50");

    compl.setAttribute("stroke-width", "1");

    svg.appendChild(compl);



    // процент выполнения  (заполнение)

    // const progress_compl = task._proj_plan ? Math.min(task.completion, 1) : 0;

    const fillRect_compl = document.createElementNS(ns, "rect");

    fillRect_compl.setAttribute("x", col5X);

    fillRect_compl.setAttribute("y", y);

    fillRect_compl.setAttribute("width", (col5X - col4X) * progress_compl);

    fillRect_compl.setAttribute("height", barHeight);

    fillRect_compl.setAttribute("rx", 4);

    fillRect_compl.setAttribute("class", "bar-completion");

    // fillRect_compl.setAttribute("fill", "#4CAF50");

    svg.appendChild(fillRect_compl);



    // ----- процент выполнения пояснение -----

    // const complValue = task.completion !== undefined ? task.completion : "—";

    const complText = document.createElementNS(ns, "text");

    complText.setAttribute("x", col5X + (col5X - col4X) / 2);

    complText.setAttribute("y", y + barHeight / 2 + 4);

    complText.setAttribute("class", "completion-text");

    complText.textContent = typeof progress_compl === 'number' ? `${progress_compl * 100}%` : progress_compl;

    svg.appendChild(complText);



    // ----- ГРАФИК (столбики Ганта) -----

    // Плановая длительность (фон)

    const bgRect = document.createElementNS(ns, "rect");

    bgRect.setAttribute("x", x);

    bgRect.setAttribute("y", y);

    bgRect.setAttribute("width", barWidth);

    bgRect.setAttribute("height", barHeight);

    bgRect.setAttribute("rx", 4);

    bgRect.setAttribute("class", "bar-plan");

    svg.appendChild(bgRect);



    // Фактическая длительность (заполнение)

    // const progress = task._proj_plan ? Math.min(task._proj_plan / 10, 1) : 0.7;

    const progress = task._proj_plan ? Math.min(task.completion, 1) : 0;

    const fillRect = document.createElementNS(ns, "rect");

    fillRect.setAttribute("x", x);

    fillRect.setAttribute("y", y);

    fillRect.setAttribute("width", barWidth * progress);

    fillRect.setAttribute("height", barHeight);

    fillRect.setAttribute("rx", 4);

    fillRect.setAttribute("class", "bar");

    fillRect.setAttribute("fill-opacity", progress > 0.8 ? 1 : 0.8);

    svg.appendChild(fillRect);







    const todayOffset = Math.floor((todayDateDt - minDate) / (24 * 60 * 60 * 1000));

    const xToday = paddingLeft2 + (todayOffset / totalDays) * chartWidth;



    if (todayDateDt >= minDate && todayDateDt <= maxDate) {

      const todayLine = document.createElementNS(ns, "line");

      todayLine.setAttribute("x1", xToday);

      todayLine.setAttribute("y1", paddingTop - 20);

      todayLine.setAttribute("x2", xToday);

      todayLine.setAttribute("y2", height - paddingBottom);

      todayLine.setAttribute("stroke", "red");

      todayLine.setAttribute("stroke-width", "1.5");

      todayLine.setAttribute("stroke-dasharray", "4,4");

      svg.appendChild(todayLine);



      const todayLabel = document.createElementNS(ns, "text");

      todayLabel.setAttribute("x", xToday + 4);

      todayLabel.setAttribute("y", paddingTop - 5);

      todayLabel.setAttribute("font-size", 11);

      todayLabel.setAttribute("fill", "red");

      // todayLabel.setAttribute("y1", paddingTop - 25);



      todayLabel.textContent = "Сегодня";

      svg.appendChild(todayLabel);



    }



    //// добавляем отставание от МСГ

    const backRep = Number(task._back_rep) || 0;

    const backlogWidth = 60;

    if (backRep > 0) {

      const backlogRect = document.createElementNS(ns, "rect");

      backlogRect.setAttribute("x", xToday - backlogWidth)

      backlogRect.setAttribute("y", y);

      backlogRect.setAttribute("width", backlogWidth);

      backlogRect.setAttribute("height", barHeight);

      backlogRect.setAttribute("rx", 4);

      backlogRect.setAttribute("fill", "#E2ADAC");

      backlogRect.setAttribute("fill-opacity", "0.6");

      backlogRect.setAttribute("class", "backlog-bar");

      svg.appendChild(backlogRect);



      const backlogtext = document.createElementNS(ns, "text");



      backlogtext.setAttribute("x", xToday - backlogWidth)

      backlogtext.setAttribute("y", y + barHeight / 3);

      backlogtext.setAttribute("class", "backlog-text");

      // backlogtext.setAttribute("text-anchor", "middle");

      // backlogtext.setAttribute("font-size", "10");

      // backlogtext.setAttribute("fill", "#1f2937");

      // backlogtext.textContent=typeof backRep === 'number' ? `${backRep.toLocaleString('ru-RU', {maximumFractionDigits:0})} ${unit}` : backRep;



      const backLabel = document.createElementNS(ns, "tspan");

      backLabel.setAttribute("x", xToday - backlogWidth);

      backLabel.setAttribute("dy", 0)

      backLabel.textContent = "Отставание:"



      const backValueLine = document.createElementNS(ns, "tspan");

      backValueLine.setAttribute("x", xToday - backlogWidth);

      backValueLine.setAttribute("dy", "1.4em")

      backValueLine.textContent = typeof backRep === 'number' ? `${backRep.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ${unit}` : backRep;



      backlogtext.appendChild(backLabel);

      backlogtext.appendChild(backValueLine);



      svg.appendChild(backlogtext);

    }



    //// добавляем опережение плана МСГ

    const forwRep = Number(task._forw_rep) || 0;

    const forwlogWidth = 60;

    if (forwRep > 0) {

      const forwlogRect = document.createElementNS(ns, "rect");

      forwlogRect.setAttribute("x", xToday)

      forwlogRect.setAttribute("y", y);

      forwlogRect.setAttribute("width", forwlogWidth);

      forwlogRect.setAttribute("height", barHeight);

      forwlogRect.setAttribute("rx", 4);

      forwlogRect.setAttribute("fill", "#4CAF50");

      forwlogRect.setAttribute("fill-opacity", "0.7");

      forwlogRect.setAttribute("class", "backlog-bar");

      svg.appendChild(forwlogRect);



      const forwlogtext = document.createElementNS(ns, "text");



      forwlogtext.setAttribute("x", xToday - backlogWidth / 2)

      forwlogtext.setAttribute("y", y + barHeight / 3);

      forwlogtext.setAttribute("text-anchor", "start");

      forwlogtext.setAttribute("font-size", "10");

      forwlogtext.setAttribute("fill", "#1f2937");

      forwlogtext.setAttribute("font-weight", "600");

      // backlogtext.textContent=typeof backRep === 'number' ? `${backRep.toLocaleString('ru-RU', {maximumFractionDigits:0})} ${unit}` : backRep;



      const forwLabel = document.createElementNS(ns, "tspan");

      forwLabel.setAttribute("x", xToday + 10);

      forwLabel.setAttribute("dy", 0)

      forwLabel.textContent = "Опережение:"



      const forwValueLine = document.createElementNS(ns, "tspan");

      forwValueLine.setAttribute("x", xToday + 10);

      forwValueLine.setAttribute("dy", "1.4em")

      forwValueLine.textContent = typeof forwRep === 'number' ? `${forwRep.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ${unit}` : forwRep;



      forwlogtext.appendChild(forwLabel);

      forwlogtext.appendChild(forwValueLine);



      svg.appendChild(forwlogtext);

    }



    ////// дополнительные настройки для меток Выполнение-факт

    const conAnchor = xToday - x;

    const offsetPos = 150

    const anchorFact = (conAnchor < offsetPos) ? "end" : "start";

    const textColFact = (conAnchor < offsetPos) ? "#182633" : "white";

    const xposFact = (conAnchor < offsetPos) ? (x - 20) : (x + 10);



    //// Выполнено в физических единицах:

    // const complNatText = document.createElementNS("http://www.w3.org/2000/svg", "text");

    const factValue = task._fact_rep !== undefined ? task._fact_rep : "—";

    const factText = document.createElementNS(ns, "text");

    if (factValue > 0) {

      factText.setAttribute("x", xposFact);

      factText.setAttribute("y", y + barHeight / 3);

      factText.setAttribute("text-anchor", anchorFact);

      factText.setAttribute("font-size", "11");

      factText.setAttribute("fill", textColFact);

      factText.setAttribute("font-weight", "600");



      const factLabel = document.createElementNS(ns, "tspan");

      // factLabel.setAttribute("x", x+10);

      factLabel.setAttribute("dy", 0)

      factLabel.textContent = "Выполнено:"



      const factValueLine = document.createElementNS(ns, "tspan");

      factValueLine.setAttribute("x", xposFact);

      factValueLine.setAttribute("dy", "1.4em")

      factValueLine.textContent = typeof factValue === 'number' ? `${factValue.toLocaleString('ru-RU')} ${unit}` : factValue;



      factText.appendChild(factLabel);

      factText.appendChild(factValueLine);



      // factText.textContent = typeof factValue === 'number' ? `Факт: ${factValue.toLocaleString('ru-RU')} ${unit}` : factValue;

      // factText.textContent = typeof factValue === 'number' ? `Факт: ${factValue.toLocaleString('ru-RU')} ${unit}` : factValue;

      svg.appendChild(factText);

    }





  });

}



//////////////////////////////////////////////////////////////////////



const kpis = [

  { value: "65%", label: "Строительная готовность объекта" },

  { value: "4.5%", label: "Отставание от МСГ" },

  { value: "декабрь 2024", label: "Прогноз завершения проекта" },

  { value: "Василек", label: "Исполнитель с максимальным отставанием от графика" }

];



// Загружаем и отрисовываем

fetch('Gantt_chart.json')

  .then(response => response.json())

  .then(data => {

    renderGanttChart(data);

  })

  .catch(error => console.error('Ошибка загрузки:', error));



// const regionData = [

//   { label: "North", value: 2.8 },

//   { label: "South", value: 3.1 },

//   { label: "East", value: 2.4 },

//   { label: "West", value: 3.7 }

// ];



// const trendData = [

//   { label: "Q1", value: 2.5 },

//   { label: "Q2", value: 2.9 },

//   { label: "Q3", value: 3.1 },

//   { label: "Q4", value: 3.5 }

// ];



renderKpis(kpis);

// renderRegionChart(chart_gantt);

// renderTrendChart(trendData);



// ---------- KPIs ----------

function renderKpis(items) {

  const grid = document.getElementById("kpi-grid");

  grid.innerHTML = items

    .map(

      k => `

      <div class="kpi-card">

        <span class="kpi-value">${escapeHtml(k.value)}</span>

        <span class="kpi-label">${escapeHtml(k.label)}</span>

      </div>`

    )

    .join("");

}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // ---------- Line chart: quarterly trend ----------

// function renderTrendChart(data) {

//   const svg = document.getElementById("trend-chart");

//   const width = 420;

//   const height = 200;

//   const paddingLeft = 30;

//   const paddingRight = 20;

//   const paddingTop = 20;

//   const paddingBottom = 30;

//   const chartWidth = width - paddingLeft - paddingRight;

//   const chartHeight = height - paddingTop - paddingBottom;



//   const maxValue = Math.max(...data.map(d => d.value)) * 1.15; // headroom above the line

//   const baseline = height - paddingBottom;



//   svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

//   svg.innerHTML = "";



//   // light horizontal gridlines

//   [0.25, 0.5, 0.75, 1].forEach(f => {

//     const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

//     gridLine.setAttribute("x1", paddingLeft);

//     gridLine.setAttribute("y1", baseline - f * chartHeight);

//     gridLine.setAttribute("x2", width - paddingRight);

//     gridLine.setAttribute("y2", baseline - f * chartHeight);

//     gridLine.setAttribute("class", "grid-line");

//     svg.appendChild(gridLine);

//   });



//   const points = data.map((d, i) => {

//     const x = paddingLeft + (i / (data.length - 1)) * chartWidth;

//     const y = baseline - (d.value / maxValue) * chartHeight;

//     return { x, y, d };

//   });



//   const pathD = points

//     .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)

//     .join(" ");



//   const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

//   path.setAttribute("d", pathD);

//   path.setAttribute("class", "line-path");

//   svg.appendChild(path);



//   // Draw-on animation: hide the line behind its own length via

//   // stroke-dasharray, then animate stroke-dashoffset to 0.

//   const length = path.getTotalLength();

//   path.style.strokeDasharray = length;

//   path.style.strokeDashoffset = length;

//   path.style.transition = "stroke-dashoffset 1s ease";



//   points.forEach((p, i) => {

//     const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");

//     dot.setAttribute("cx", p.x);

//     dot.setAttribute("cy", p.y);

//     dot.setAttribute("r", 4);

//     dot.setAttribute("class", "line-dot");

//     dot.style.opacity = "0";

//     dot.style.transition = "opacity 0.3s ease";

//     dot.style.transitionDelay = `${0.6 + i * 0.1}s`;



//     const title = document.createElementNS("http://www.w3.org/2000/svg", "title");

//     title.textContent = `${p.d.label}: $${p.d.value}M`;

//     dot.appendChild(title);

//     svg.appendChild(dot);



//     const label = document.createElementNS("http://www.w3.org/2000/svg", "text");

//     label.setAttribute("x", p.x);

//     label.setAttribute("y", height - paddingBottom + 16);

//     label.setAttribute("text-anchor", "middle");

//     label.setAttribute("class", "bar-label");

//     label.textContent = p.d.label;

//     svg.appendChild(label);



//     requestAnimationFrame(() => {

//       requestAnimationFrame(() => {

//         dot.style.opacity = "1";

//       });

//     });

//   });

//   requestAnimationFrame(() => {

//     requestAnimationFrame(() => {

//       path.style.strokeDashoffset = "0";

//     });

//   });

// }



function escapeHtml(str) {

  return String(str)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;");

}

