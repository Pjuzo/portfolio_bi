const constr_completion_data = {
  "projects": [
    {
      "project": "Ромашка",
      "plan_compl": 0.62,
      "fact_compl": 0.54
    },
    {
      "project": "Лютик",
      "plan_compl": 0.96,
      "fact_compl": 0.75
    },
    {
      "project": "Василек",
      "plan_compl": 1,
      "fact_compl": 0.85
    },
    {
      "project": "Репей",
      "plan_compl": 0.84,
      "fact_compl": 0.78
    },
    {
      "project": "Полынь",
      "plan_compl": 0.42,
      "fact_compl": 0.25
    },
  ]
}
const headcount_data = {
  "projects": [
    {
      "project": "Ромашка",
      "plan_hc": 3299,
      "fact_hc": 2257
    },
    {
      "project": "Лютик",
      "plan_hc": 2328,
      "fact_hc": 2053
    },
    {
      "project": "Василек",
      "plan_hc": 1470,
      "fact_hc": 1250
    },
    {
      "project": "Репей",
      "plan_hc": 1300,
      "fact_hc": 1005
    },
    {
      "project": "Полынь",
      "plan_hc": 878,
      "fact_hc": 900
    },
  ]
}
const term_data = {
  "projects": [
    {
      "project": "Ромашка",
      "plan_dt": '2027-03-30',
      "fact_dt": '2027-08-31'
    },
    {
      "project": "Лютик",
      "plan_dt": '2026-08-31',
      "fact_dt": '2026-12-31'
    },
    {
      "project": "Василек",
      "plan_dt": '2026-11-30',
      "fact_dt": '2027-11-15'
    },
    {
      "project": "Репей",
      "plan_dt": '2027-02-20',
      "fact_dt": '2027-05-31'
    },
    {
      "project": "Полынь",
      "plan_dt": '2027-06-30',
      "fact_dt": '2027-07-31'
    },
  ]
}
const cost_data = {
  "projects": [
    {
      "project": "Ромашка",
      "contract_sum": 67433,
      "expertise_sum": 90504,
      "forecast_sum": 76645,
      "fact_excess": 0
    },
    {
      "project": "Лютик",
      "contract_sum": 67398,
      "expertise_sum": 77756,
      "forecast_sum": 88865,
      "fact_excess": 4000
    },
    {
      "project": "Василек",
      "contract_sum": 45398,
      "expertise_sum": 57756,
      "forecast_sum": 50865,
      "fact_excess": 0
    },
    {
      "project": "Репей",
      "contract_sum": 37398,
      "expertise_sum": 47756,
      "forecast_sum": 52865,
      "fact_excess": 3000
    },
    {
      "project": "Полынь",
      "contract_sum": 27398,
      "expertise_sum": 37756,
      "forecast_sum": 52865,
      "fact_excess": 5000
    }
  ]
};
const act_data = {
  "projects": [
    {
      "project": "Ромашка",
      "act_sum": 26433,
      "wip_sum": 16645,
      "expertise_sum": 90504
    },
    {
      "project": "Лютик",
      "act_sum": 17398,
      "wip_sum": 11865,
      "expertise_sum": 77756
    },
    {
      "project": "Василек",
      "act_sum": 25398,
      "wip_sum": 5865,
      "expertise_sum": 57756
    },
    {
      "project": "Репей",
      "act_sum": 17398,
      "wip_sum": 7865,
      "expertise_sum": 47756
    },
    {
      "project": "Полынь",
      "act_sum": 15398,
      "wip_sum": 8865,
      "expertise_sum": 37756
    }
  ]
};
// function calculateCompletion() {
// const completion =
// constr_completion_data.projects
// .map(project => {
// const plan = project.plan_compl;
// const fact = project.fact_compl;
// return {
// ...project,
// // index,
// // project_num:
// // project[index],
// plan,
// fact
// };
// });
// return {
// completion
// };
// }
// console.log(calculateCompletion());
const proj_colors = {
  ColorTotal: "#9AA6B9", // Light grey for total
  ColorFact: "#49678D", // blue
  ColorPlan: "#007FFF", // light blue
  ColorPlan2: "#9AA6B9",
  ColorText: "#23415A", // Dark blue
  negative: '#e31a1c',
  text_color: '#3E5F8A',
  ColorRatio: "#e0703a",
  ColorDelay: "#d64545",
  ColorOnTime: "#228B22",
  ColorPlanMarker: "#2c3e50",
  ColorContract: "#a9b4c2",
  ColorExpertise: "#5b6b84",
  ColorForecast: "#1e88ff",
  ColorForecast2: '#8DACCD',
  ColorExcessForecast: "#f2a3a3",
  ColorSurplusForecast: "#7AB67A",
  ColorExcessFact: "#c0392b",
  ColorDashLine: "#e03131"
}

function render_project_completion_chart(data, options = {}) {
  const projects = data.projects;

  const svg = document.getElementById("completion-chart");
  const containerWidth = svg.parentElement.clientWidth;
  const containerHeight = svg.parentElement.clientHeight;   // NEW

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const width = options.width || containerWidth;
  const height = options.height || containerHeight;          

  if (!projects || projects.length === 0) {
    console.warn('no data');
    return;
  }

  // ---- horizontal factors: still width-driven (bar length, label column) ----
  const paddingLeft = clamp(width * 0.01, 8, 16);
  const paddingRight = clamp(width * 0.02, 5, 30);
  const barAreaRatio = options.barAreaRatio || 0.95;
  const gap_label = clamp(width * 0.2, 30, 110);
  const cornerRadius = clamp(width * 0.008, 4, 6);

  // ---- vertical factors: now height-driven, not width-driven ----
  const n = projects.length;
  const legendSize = clamp(height * 0.05, 9, 14);
  const legendRowHeight = legendSize + clamp(height * 0.04, 8, 16);
  const paddingTop = legendRowHeight + clamp(height * 0.02, 6, 14);
  const paddingBottom = clamp(height * 0.01, 2, 8);

  const availableRowSpace = height - paddingTop - paddingBottom;
  const rowGap = availableRowSpace / n;          // total vertical budget per project
  const barHeight = clamp(rowGap * 0.35, 10, 21);  // each bar's thickness is a slice of that budget
  const gap_y = clamp(rowGap * 0.06, 2, 8);       // gap between plan bar and fact bar within a row
  const gap = rowGap - barHeight * 2 - gap_y;      // remaining space = gap between project groups

  const fontSizeLabel = clamp(Math.min(width, height) * 0.02, 9, 14);
  const fontSizeValue = clamp(Math.min(width, height) * 0.02, 9, 13);

  const ns = "http://www.w3.org/2000/svg";

  const barWidth = (width - paddingLeft - paddingRight - gap_label) * barAreaRatio;
  console.log('width: ', width)
  console.log('paddingLeft: ', paddingLeft)
  console.log('paddingRight: ', paddingRight)
  console.log('gap_label: ', gap_label)
  console.log('barAreaRatio: ', barAreaRatio)
  console.log('barWidth: ', barWidth)
  // console.log('', )

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");   // NEW — width & height both match container exactly
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.innerHTML = "";

  const legendY = (legendRowHeight - legendSize) / 2;

  // ---- legend ----
  const legend_plan = document.createElementNS(ns, "rect");
  legend_plan.setAttribute("x", paddingLeft + gap_label);
  legend_plan.setAttribute("y", legendY);
  legend_plan.setAttribute("width", legendSize);
  legend_plan.setAttribute("height", legendSize);
  legend_plan.setAttribute("rx", cornerRadius * 0.8);
  legend_plan.setAttribute("fill", proj_colors.ColorPlan);
  svg.appendChild(legend_plan);

  const legend_plan_text = document.createElementNS(ns, "text");
  legend_plan_text.setAttribute("x", paddingLeft + gap_label + legendSize + 4);
  legend_plan_text.setAttribute("y", legendY + legendSize * 0.9);
  legend_plan_text.setAttribute("class", "legend-label");
  legend_plan_text.setAttribute("font-size", fontSizeLabel);
  legend_plan_text.textContent = "план";
  svg.appendChild(legend_plan_text);

  const legend_fact = document.createElementNS(ns, "rect");
  legend_fact.setAttribute("x", paddingLeft + gap_label * 2);
  legend_fact.setAttribute("y", legendY);
  legend_fact.setAttribute("width", legendSize);
  legend_fact.setAttribute("height", legendSize);
  legend_fact.setAttribute("rx", cornerRadius * 0.8);
  legend_fact.setAttribute("fill", proj_colors.ColorFact);
  svg.appendChild(legend_fact);

  const legend_fact_text = document.createElementNS(ns, "text");
  legend_fact_text.setAttribute("x", paddingLeft + gap_label * 2 + legendSize + 4);
  legend_fact_text.setAttribute("y", legendY + legendSize * 0.9);
  legend_fact_text.setAttribute("class", "legend-label");
  legend_fact_text.setAttribute("font-size", fontSizeLabel);
  legend_fact_text.textContent = "факт";
  svg.appendChild(legend_fact_text);

  // ---- bars ----
  projects.forEach((project, i) => {
    const y = paddingTop + i * (barHeight * 2 + gap_y + gap);
    const x = paddingLeft;
    const planW = Math.max((project.plan_compl || 0) * barWidth, 0);
    const factW = Math.max((project.fact_compl || 0) * barWidth, 1);

    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", x);
    label.setAttribute("y", y + barHeight + gap_y / 2);
    label.setAttribute("class", "bar-label_completion");
    label.setAttribute("font-size", fontSizeLabel);
    label.textContent = project.project || "—";
    svg.appendChild(label);

    const bgRect = document.createElementNS(ns, "rect");
    bgRect.setAttribute("x", x + gap_label);
    bgRect.setAttribute("y", y);
    bgRect.setAttribute("width", barWidth);
    bgRect.setAttribute("height", barHeight);
    bgRect.setAttribute("rx", cornerRadius);
    bgRect.setAttribute("class", "bar-plan");
    bgRect.setAttribute("fill-opacity", 0.5);
    svg.appendChild(bgRect);

    const fillRect = document.createElementNS(ns, "rect");
    fillRect.setAttribute("x", x + gap_label);
    fillRect.setAttribute("y", y);
    fillRect.setAttribute("width", planW);
    fillRect.setAttribute("height", barHeight);
    fillRect.setAttribute("rx", cornerRadius);
    fillRect.setAttribute("class", "bar-plan");
    svg.appendChild(fillRect);

    const bgRectFact = document.createElementNS(ns, "rect");
    bgRectFact.setAttribute("x", x + gap_label);
    bgRectFact.setAttribute("y", y + barHeight + gap_y);
    bgRectFact.setAttribute("width", barWidth);
    bgRectFact.setAttribute("height", barHeight);
    bgRectFact.setAttribute("rx", cornerRadius);
    bgRectFact.setAttribute("class", "bar-fact");
    bgRectFact.setAttribute("fill-opacity", 0.3);
    svg.appendChild(bgRectFact);

    const fillRectFact = document.createElementNS(ns, "rect");
    fillRectFact.setAttribute("x", x + gap_label);
    fillRectFact.setAttribute("y", y + barHeight + gap_y);
    fillRectFact.setAttribute("width", factW);
    fillRectFact.setAttribute("height", barHeight);
    fillRectFact.setAttribute("rx", cornerRadius);
    fillRectFact.setAttribute("class", "bar-fact");
    svg.appendChild(fillRectFact);

    const planValue = project.plan_compl !== undefined ? project.plan_compl : 0;
    if (planValue > 0) {
      const planText = document.createElementNS(ns, "text");
      planText.setAttribute("x", x + gap_label + planW - 10);
      planText.setAttribute("y", y + barHeight / 2 + fontSizeValue / 3);
      planText.setAttribute("text-anchor", "end");
      planText.setAttribute("font-size", fontSizeValue);
      planText.setAttribute("fill", "white");
      planText.setAttribute("font-weight", "600");
      planText.textContent = typeof planValue === 'number' ? `${planValue * 100}%` : planValue;
      svg.appendChild(planText);
    }

    const factValue = project.fact_compl !== undefined ? project.fact_compl : 0;
    if (factValue > 0) {
      const factText = document.createElementNS(ns, "text");
      factText.setAttribute("x", x + gap_label + factW - 10);
      factText.setAttribute("y", y + barHeight + gap_y + barHeight / 2 + fontSizeValue / 3);
      factText.setAttribute("text-anchor", "end");
      factText.setAttribute("font-size", fontSizeValue);
      factText.setAttribute("fill", "white");
      factText.setAttribute("font-weight", "600");
      factText.textContent = typeof factValue === 'number' ? `${factValue * 100}%` : factValue;
      svg.appendChild(factText);
    }
  });
}

render_project_completion_chart(constr_completion_data);
let resizeTimer;
const chartContainer = document.getElementById("completion-chart").parentElement;
const ro = new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    render_project_completion_chart(constr_completion_data); // your original data
  }, 150);
});
ro.observe(chartContainer);
//////////строительная готовность объектов окончание вставки
//////////////////////////////////////////////////////
/////////// функция для графика по срокам;
////////////////////////////////////////////////////////
function render_term_delay_chart(data, options = {}) {
  const projects = data.projects;
  const svg = document.getElementById("term-chart");
  const containerWidth = svg.parentElement.clientWidth;
  const containerHeight = svg.parentElement.clientHeight;   // NEW
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const width = options.width || containerWidth;
  const height = options.height || containerHeight;          // NEW — trust the container

  if (!projects || projects.length === 0) {
    console.warn('no data');
    return;
  }

  const paddingLeft = clamp(width * 0.01, 8, 16);
  const paddingRight = clamp(width * 0.09, 40, 100);
  const paddingBottom = clamp(height * 0.09, 10, 24);          // now height-driven
  const gap_label = clamp(width * 0.11, 80, 150);
  const fontSizeLabel = clamp(Math.min(width, height) * 0.03, 8, 12);   // scale off the smaller dimension
  const fontSizeValue = clamp(Math.min(width, height) * 0.026, 9, 14);
  const fontSizeAxis = clamp(Math.min(width, height) * 0.022, 5, 8);
  const legendSize = clamp(height * 0.05, 12, 16);
  const markerSize = clamp(height * 0.03, 6, 11);
  const legendRowHeight = legendSize + clamp(height * 0.03, 8, 16);
  const paddingTop = legendRowHeight + clamp(height * 0.03, 8, 16);

  const plotLeft = paddingLeft + gap_label;
  const plotWidth = width - plotLeft - paddingRight;

  // ---- row spacing now derived FROM available height, not the reverse ----
  const n = projects.length;
  const availableRowSpace = height - paddingTop - paddingBottom;
  const rowGap = availableRowSpace / n;                        // NEW — each row's total vertical budget
  const barHeight = clamp(rowGap * 0.12, 2, 5);                 // bar thickness is a slice of that budget
  const gap = rowGap;                                           // "gap" now literally means row pitch

  const plotBottom = paddingTop + n * gap;
  const ns = "http://www.w3.org/2000/svg";

  const colorPlan = proj_colors.ColorPlan || "#4a7fd1";
  const colorDelay = proj_colors.negative || "#d64545";
  const colorOnTime = proj_colors.ColorOnTime || "#3fa34d";
  // height is no longer computed — it IS containerHeight already

  const msPerDay = 1000 * 60 * 60 * 24;

  // ---- parse dates, compute time scale ----
  const parsed = projects.map(p => ({
    ...p,
    planTs: new Date(p.plan_dt).getTime(),
    factTs: new Date(p.fact_dt).getTime()
  }));
  const allTs = parsed.flatMap(p => [p.planTs, p.factTs]);
  let minTs = Math.min(...allTs);
  let maxTs = Math.max(...allTs);
  const range = maxTs - minTs;
  const pad = Math.max(range * 0.08, msPerDay * 15); // never a zero-width scale
  minTs -= pad;
  maxTs += pad;
  const xScale = (ts) => plotLeft + ((ts - minTs) / (maxTs - minTs)) * plotWidth;
  const formatTick = (ts) => new Date(ts).toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' });
  const formatDate = (ts) => new Date(ts).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");              // NEW — width & height both match container exactly now
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.innerHTML = "";
  // ---- legend ----
  const legendY = (legendRowHeight - legendSize) / 2;
  const legendPlan = document.createElementNS(ns, "rect");
  legendPlan.setAttribute("x", plotLeft);
  legendPlan.setAttribute("y", legendY);
  legendPlan.setAttribute("width", legendSize);
  legendPlan.setAttribute("height", legendSize * 0.2);
  legendPlan.setAttribute("rx", legendSize * 0.25);
  legendPlan.setAttribute("fill", colorPlan);
  svg.appendChild(legendPlan);
  const legendPlanText = document.createElementNS(ns, "text");
  legendPlanText.setAttribute("x", plotLeft + legendSize + 6);
  legendPlanText.setAttribute("y", legendY + legendSize * 0.4);
  legendPlanText.setAttribute("class", "legend-label");
  legendPlanText.setAttribute("font-size", fontSizeLabel);
  legendPlanText.textContent = "по плану";
  svg.appendChild(legendPlanText);
  const legendW1 = plotLeft + legendSize + fontSizeLabel * 7;
  const legendDelay = document.createElementNS(ns, "rect");
  legendDelay.setAttribute("x", legendW1 * 1.1);
  legendDelay.setAttribute("y", legendY);
  legendDelay.setAttribute("width", legendSize);
  legendDelay.setAttribute("height", legendSize * 0.2);
  legendDelay.setAttribute("rx", legendSize * 0.25);
  legendDelay.setAttribute("fill", colorDelay);
  svg.appendChild(legendDelay);
  const legendDelayText = document.createElementNS(ns, "text");
  legendDelayText.setAttribute("x", legendW1 * 1.1 + legendSize + 6);
  legendDelayText.setAttribute("y", legendY + legendSize * 0.4);
  legendDelayText.setAttribute("class", "legend-label");
  legendDelayText.setAttribute("font-size", fontSizeLabel);
  legendDelayText.textContent = "просрочка";
  svg.appendChild(legendDelayText);
  const legendW2 = legendW1 * 1.1 + legendSize + 6 + fontSizeLabel * 5;
  // const legendMarker = document.createElementNS(ns, "rect");
  const mkY = legendY + legendSize * 0.25;
  // legendMarker.setAttribute("x", legendW2 + legendSize * 0.25);
  // legendMarker.setAttribute("y", mkY - legendSize * 0.25);
  // legendMarker.setAttribute("width", legendSize * 0.5);
  // legendMarker.setAttribute("height", legendSize * 0.5);
  // legendMarker.setAttribute("fill", colorMarker);
  // legendMarker.setAttribute("transform", `rotate(45 ${legendW2 + legendSize * 0.5} ${mkY})`);
  // svg.appendChild(legendMarker);
  const legendMarker = document.createElementNS(ns, "circle");
  legendMarker.setAttribute("cx", legendW2 * 1.2 + legendSize * 0.25);
  legendMarker.setAttribute("cy", mkY - legendSize * 0.25);
  legendMarker.setAttribute("r", markerSize / 1.4);
  legendMarker.setAttribute("fill", colorPlan);
  svg.appendChild(legendMarker);
  const legendMarkerText = document.createElementNS(ns, "text");
  legendMarkerText.setAttribute("x", legendW2 * 1.2 + legendSize);
  legendMarkerText.setAttribute("y", legendY + legendSize * 0.4);
  legendMarkerText.setAttribute("class", "legend-label");
  legendMarkerText.setAttribute("font-size", fontSizeLabel);
  legendMarkerText.textContent = "срок план";
  svg.appendChild(legendMarkerText);
  // ---- vertical date gridlines + axis labels ----
  // ---- vertical date gridlines + axis labels ----
  const tickCount = 5;
  for (let t = 0; t <= tickCount; t++) {
    const ts = minTs + ((maxTs - minTs) / tickCount) * t;
    const x = xScale(ts);

    const gridLine = document.createElementNS(ns, "line");
    gridLine.setAttribute("x1", x);
    gridLine.setAttribute("x2", x);
    gridLine.setAttribute("y1", paddingTop - 6);
    gridLine.setAttribute("y2", plotBottom);
    gridLine.setAttribute("stroke", "currentColor");
    gridLine.setAttribute("stroke-opacity", 0.1);
    svg.appendChild(gridLine);

    // NEW: flip anchor for the first/last tick so text stays inside the plot area
    let anchor = "middle";
    if (t === 0) anchor = "start";
    else if (t === tickCount) anchor = "end";

    const tickLabel = document.createElementNS(ns, "text");
    tickLabel.setAttribute("x", x);
    tickLabel.setAttribute("y", plotBottom + fontSizeAxis + 10);
    tickLabel.setAttribute("text-anchor", anchor);   // was: "middle" always
    tickLabel.setAttribute("class", "term-x-label");
    tickLabel.setAttribute("font-size", fontSizeAxis);
    tickLabel.textContent = formatTick(ts);
    svg.appendChild(tickLabel);
  }
  // ---- rows ----
  parsed.forEach((project, i) => {
    const y = paddingTop + i * (barHeight + gap);//+ barHeight / 2;
    const startX = plotLeft;
    const planX = xScale(project.planTs);
    const factX = xScale(project.factTs);
    const delayed = project.factTs > project.planTs;
    const diffDays = Math.round((project.factTs - project.planTs) / msPerDay);
    // project name label
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", paddingLeft);
    label.setAttribute("y", y + fontSizeLabel / 3);
    label.setAttribute("class", "term-y-label");
    label.setAttribute("font-size", fontSizeLabel);
    label.textContent = project.project || "—";
    svg.appendChild(label);
    if (delayed) {
      // full pill (start -> fact) drawn first in red, giving true rounded end caps
      const delayLine = document.createElementNS(ns, "line");
      delayLine.setAttribute("x1", startX);
      delayLine.setAttribute("x2", factX);
      delayLine.setAttribute("y1", y);
      delayLine.setAttribute("y2", y);
      delayLine.setAttribute("stroke", colorDelay);
      delayLine.setAttribute("stroke-width", barHeight);
      delayLine.setAttribute("stroke-linecap", "round");
      svg.appendChild(delayLine);
      // blue overlay (start -> plan) drawn on top, covering the "within plan" portion
      const planLine = document.createElementNS(ns, "line");
      planLine.setAttribute("x1", startX);
      planLine.setAttribute("x2", planX);
      planLine.setAttribute("y1", y);
      planLine.setAttribute("y2", y);
      planLine.setAttribute("stroke", colorPlan);
      planLine.setAttribute("stroke-width", barHeight);
      planLine.setAttribute("stroke-linecap", "round");
      svg.appendChild(planLine);
    } else {
      // on time / early: single green pill, true rounded caps at both true ends
      const onTimeLine = document.createElementNS(ns, "line");
      onTimeLine.setAttribute("x1", startX);
      onTimeLine.setAttribute("x2", factX);
      onTimeLine.setAttribute("y1", y);
      onTimeLine.setAttribute("y2", y);
      onTimeLine.setAttribute("stroke", colorOnTime);
      onTimeLine.setAttribute("stroke-width", barHeight);
      onTimeLine.setAttribute("stroke-linecap", "round");
      svg.appendChild(onTimeLine);
    }
    // circle marker at the planned date (always shown, for reference)
    const marker = document.createElementNS(ns, "circle");
    marker.setAttribute("cx", planX);
    marker.setAttribute("cy", y - barHeight);
    marker.setAttribute("r", markerSize / 1.4);
    marker.setAttribute("fill", colorPlan);
    svg.appendChild(marker);
    // fact date label, above the end of the pill
    const factLabel = document.createElementNS(ns, "text");
    factLabel.setAttribute("x", factX);
    factLabel.setAttribute("y", y - barHeight / 2 - 6);
    factLabel.setAttribute("text-anchor", delayed ? "start" : "middle");
    factLabel.setAttribute("font-size", fontSizeValue);
    factLabel.setAttribute("font-weight", "600");
    factLabel.setAttribute("fill", delayed ? colorDelay : colorOnTime);
    factLabel.textContent = formatDate(project.factTs);
    svg.appendChild(factLabel);
    // delay/lead delta label
    const deltaLabel = document.createElementNS(ns, "text");
    deltaLabel.setAttribute("x", factX);
    deltaLabel.setAttribute("y", y + barHeight / 2 + fontSizeValue);
    deltaLabel.setAttribute("text-anchor", delayed ? "start" : "middle");
    deltaLabel.setAttribute("font-size", fontSizeValue);
    deltaLabel.setAttribute("fill", delayed ? colorDelay : colorOnTime);
    deltaLabel.textContent = diffDays > 0 ? `+${diffDays} дн.` : diffDays < 0 ? `${diffDays} дн.` : "on time";
    svg.appendChild(deltaLabel);
  });
  // ---- baseline axis ----
  const axisLine = document.createElementNS(ns, "line");
  axisLine.setAttribute("x1", plotLeft);
  axisLine.setAttribute("x2", width - paddingRight);
  axisLine.setAttribute("y1", plotBottom);
  axisLine.setAttribute("y2", plotBottom);
  axisLine.setAttribute("stroke", "currentColor");
  axisLine.setAttribute("stroke-opacity", 0.2);
  svg.appendChild(axisLine);
}
let resizeTimerTerm;
const termContainer = document.getElementById("term-chart").parentElement;
const roTerm = new ResizeObserver(() => {
  clearTimeout(resizeTimerTerm);
  resizeTimerTerm = setTimeout(() => {
    render_term_delay_chart(term_data);
  }, 150);
});
roTerm.observe(termContainer);
render_term_delay_chart(term_data);
////////////////////////////////////////////////////////
//// вертикальный bar chart для численности
///////////////////////////////////////////////////

function render_headcount_chart(data, options = {}) {
  const projects = data.projects;
  const svg = document.getElementById("headcount-chart");
  const containerWidth = svg.parentElement.clientWidth;
  const containerHeight = svg.parentElement.clientHeight;   // NEW
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const width = options.width || containerWidth;
  const height = options.height || containerHeight;          // NEW — trust the container

  if (!projects || projects.length === 0) {
    console.warn('no data');
    return;
  }

  // ---- horizontal factors: still width-driven ----
  const paddingLeft = clamp(width * 0.045, 10, 20);
  const axisGap = clamp(width * 0.02, 1, 5);
  const plotLeft = paddingLeft + axisGap;
  const paddingRight = clamp(width * 0.02, 12, 30);
  const barAreaRatio = options.barAreaRatio || 0.6;
  const cornerRadius = clamp(width * 0.006, 3, 4);
  const barGapInner = clamp(width * 0.0002, 1, 4);

  // ---- vertical factors: now height-driven, not width-driven ----
  const fontSizeLabel = clamp(Math.min(width, height) * 0.045, 9, 14);
  const fontSizeValue = clamp(Math.min(width, height) * 0.05, 10, 16);
  const fontSizeAxis = clamp(Math.min(width, height) * 0.035, 8, 12);
  const legendSize = clamp(height * 0.045, 6, 10);
  const markerSize = clamp(height * 0.05, 8, 13);

  const legendRowHeight = legendSize + clamp(height * 0.06, 10, 20);
  const paddingTop = legendRowHeight + clamp(height * 0.05, 8, 15);
  const paddingBottom = clamp(height * 0.09, 20, 40);   // room for project-name axis labels

  const plotHeight = height - paddingTop - paddingBottom;   // NEW — fills whatever's left, not width-guessed

  const ns = "http://www.w3.org/2000/svg";

  // ---- bar scale (headcount) ----
  const rawMax = Math.max(...projects.map(p => Math.max(p.plan_hc || 0, p.fact_hc || 0)));

  const niceMax = (() => {
    if (rawMax <= 0) return 100;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const normalized = rawMax / magnitude;
    let niceNormalized;
    if (normalized <= 1) niceNormalized = 1;
    else if (normalized <= 2) niceNormalized = 2;
    else if (normalized <= 4) niceNormalized = 4;
    else if (normalized <= 5) niceNormalized = 5;
    else niceNormalized = 10;
    return niceNormalized * magnitude;
  })();
  const yScale = (value) => plotHeight * (value / niceMax);

  // ---- ratio scale (fact/plan %), independent of the headcount scale ----
  const ratios = projects.map(p => {
    const plan = p.plan_hc || 0;
    const fact = p.fact_hc || 0;
    return plan > 0 ? (fact / plan) * 100 : 0;
  });
  const rawRatioMax = Math.max(...ratios, 100);
  const ratioMax = Math.ceil(rawRatioMax / 20) * 20 + 20;
  const ratioTopMargin = fontSizeValue + clamp(height * 0.04, 10, 20);
  const ratioPlotHeight = plotHeight - ratioTopMargin;    // NEW — was plotHeight*1.4, now fits within plotHeight itself
  const yScaleRatio = (pct) => ratioPlotHeight * (pct / ratioMax);

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");        // NEW
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.innerHTML = "";

  // ---- legend row ----
  const gap_label = clamp(width * 0.08, 50, 110);
  const legendY = (legendRowHeight - legendSize) / 2;

  const legend_plan = document.createElementNS(ns, "rect");
  legend_plan.setAttribute("x", paddingLeft);
  legend_plan.setAttribute("y", legendY);
  legend_plan.setAttribute("width", legendSize);
  legend_plan.setAttribute("height", legendSize);
  legend_plan.setAttribute("rx", cornerRadius * 0.8);
  legend_plan.setAttribute("fill", proj_colors.ColorPlan2);
  svg.appendChild(legend_plan);

  const legend_plan_text = document.createElementNS(ns, "text");
  legend_plan_text.setAttribute("x", paddingLeft + legendSize + 4);
  legend_plan_text.setAttribute("y", legendY + legendSize * 0.9);
  legend_plan_text.setAttribute("class", "legend-label");
  legend_plan_text.setAttribute("font-size", fontSizeLabel);
  legend_plan_text.textContent = "план";
  svg.appendChild(legend_plan_text);

  const legend_fact = document.createElementNS(ns, "rect");
  legend_fact.setAttribute("x", paddingLeft + gap_label);
  legend_fact.setAttribute("y", legendY);
  legend_fact.setAttribute("width", legendSize);
  legend_fact.setAttribute("height", legendSize);
  legend_fact.setAttribute("rx", cornerRadius * 0.8);
  legend_fact.setAttribute("fill", proj_colors.ColorFact);
  svg.appendChild(legend_fact);

  const legend_fact_text = document.createElementNS(ns, "text");
  legend_fact_text.setAttribute("x", paddingLeft + gap_label + legendSize + 4);
  legend_fact_text.setAttribute("y", legendY + legendSize * 0.9);
  legend_fact_text.setAttribute("class", "legend-label");
  legend_fact_text.setAttribute("font-size", fontSizeLabel);
  legend_fact_text.textContent = "факт";
  svg.appendChild(legend_fact_text);

  // Ratio line legend swatch
  const ratioColor = (proj_colors.ColorPlan) || "#e0703a";
  const legendRatioX = paddingLeft + gap_label * 2;

  const legend_ratio_line = document.createElementNS(ns, "line");
  legend_ratio_line.setAttribute("x1", legendRatioX);
  legend_ratio_line.setAttribute("x2", legendRatioX + legendSize * 1.6);
  legend_ratio_line.setAttribute("y1", legendY + legendSize / 2);
  legend_ratio_line.setAttribute("y2", legendY + legendSize / 2);
  legend_ratio_line.setAttribute("stroke", ratioColor);
  legend_ratio_line.setAttribute("stroke-width", 2);
  legend_ratio_line.setAttribute("stroke-dasharray", "4,3");
  svg.appendChild(legend_ratio_line);

  const legend_ratio_marker = document.createElementNS(ns, "rect");
  legend_ratio_marker.setAttribute("x", legendRatioX + legendSize * 0.8 - markerSize / 2);
  legend_ratio_marker.setAttribute("y", legendY + legendSize / 2 - markerSize / 2);
  legend_ratio_marker.setAttribute("width", markerSize);
  legend_ratio_marker.setAttribute("height", markerSize);
  legend_ratio_marker.setAttribute("fill", ratioColor);
  svg.appendChild(legend_ratio_marker);

  const legend_ratio_text = document.createElementNS(ns, "text");
  legend_ratio_text.setAttribute("x", legendRatioX + legendSize * 1.6 + 6);
  legend_ratio_text.setAttribute("y", legendY + legendSize * 0.9);
  legend_ratio_text.setAttribute("class", "legend-label");
  legend_ratio_text.setAttribute("font-size", fontSizeLabel);
  legend_ratio_text.textContent = "обеспеченность %";
  svg.appendChild(legend_ratio_text);

  // ---- Y-axis gridlines (headcount scale) ----
  const tickCount = 4;
  for (let t = 0; t <= tickCount; t++) {
    const value = (niceMax / tickCount) * t;
    const y = paddingTop + plotHeight - yScale(value);

    const gridLine = document.createElementNS(ns, "line");
    gridLine.setAttribute("x1", plotLeft);
    gridLine.setAttribute("x2", width - paddingRight);
    gridLine.setAttribute("y1", y);
    gridLine.setAttribute("y2", y);
    gridLine.setAttribute("stroke", "currentColor");
    gridLine.setAttribute("stroke-opacity", t === 0 ? 0.3 : 0.1);
    svg.appendChild(gridLine);
  }

  // ---- bar groups ----
  const plotWidth = width - plotLeft - paddingRight;
  const groupWidth = plotWidth / projects.length;
  const barsWidth = groupWidth * barAreaRatio;
  const singleBarWidth = (barsWidth - barGapInner) / 1.6;
  const baseline = paddingTop + plotHeight;

  const ratioPoints = [];

  projects.forEach((project, i) => {
    const groupX = plotLeft + i * groupWidth + (groupWidth - barsWidth) / 2;
    const planVal = project.plan_hc || 0;
    const factVal = project.fact_hc || 0;
    const planH = yScale(planVal);
    const factH = yScale(factVal);

    const planX = groupX;
    const planY = baseline - planH;
    const planRect = document.createElementNS(ns, "rect");
    planRect.setAttribute("x", planX);
    planRect.setAttribute("y", planY);
    planRect.setAttribute("width", singleBarWidth);
    planRect.setAttribute("height", planH);
    planRect.setAttribute("rx", cornerRadius);
    planRect.setAttribute("class", "bar-plan2");
    svg.appendChild(planRect);

    const factX = groupX + singleBarWidth + barGapInner;
    const factY = baseline - factH;
    const factRect = document.createElementNS(ns, "rect");
    factRect.setAttribute("x", factX);
    factRect.setAttribute("y", factY);
    factRect.setAttribute("width", singleBarWidth);
    factRect.setAttribute("height", factH);
    factRect.setAttribute("rx", cornerRadius);
    factRect.setAttribute("class", "bar-fact");
    svg.appendChild(factRect);

    if (planVal > 0) {
      const planText = document.createElementNS(ns, "text");
      planText.setAttribute("x", planX + singleBarWidth / 2);
      planText.setAttribute("y", planY - 4);
      planText.setAttribute("font-size", fontSizeValue);
      planText.setAttribute("class", "bar-label-hc-plan");
      planText.textContent = planVal.toLocaleString('ru-RU');
      svg.appendChild(planText);
    }

    if (factVal > 0) {
      const factText = document.createElementNS(ns, "text");
      factText.setAttribute("x", factX + singleBarWidth / 2 + 4);
      factText.setAttribute("y", factY - 4);
      factText.setAttribute("text-anchor", "start");
      factText.setAttribute("font-size", fontSizeValue);
      factText.setAttribute("class", "bar-label-hc-fact");
      factText.textContent = factVal.toLocaleString('ru-RU');
      svg.appendChild(factText);
    }

    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", groupX + singleBarWidth);
    label.setAttribute("y", baseline + fontSizeLabel + 8);
    label.setAttribute("class", "bar-label-hc-proj");
    label.setAttribute("font-size", fontSizeLabel);
    label.textContent = project.project || "—";
    svg.appendChild(label);

    const pct = planVal > 0 ? (factVal / planVal) * 100 : 0;
    const pointX = groupX + barsWidth / 2;
    const pointY = baseline - yScaleRatio(pct);
    ratioPoints.push({ x: pointX, y: pointY, pct });
  });

  // ---- ratio line ----
  if (ratioPoints.length > 0) {
    const pathData = ratioPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y*0.7}`)
      .join(" ");
    const linePath = document.createElementNS(ns, "path");
    linePath.setAttribute("d", pathData);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", ratioColor);
    linePath.setAttribute("stroke-width", clamp(Math.min(width, height) * 0.004, 1.5, 3));
    linePath.setAttribute("stroke-dasharray", "6,4");
    svg.appendChild(linePath);

    ratioPoints.forEach((p) => {
      const marker = document.createElementNS(ns, "rect");
      marker.setAttribute("x", p.x - markerSize / 2);
      marker.setAttribute("y", p.y*0.7 - markerSize / 2);
      marker.setAttribute("width", markerSize);
      marker.setAttribute("height", markerSize);
      marker.setAttribute("fill", ratioColor);
      svg.appendChild(marker);

      const pctText = document.createElementNS(ns, "text");
      pctText.setAttribute("x", p.x);
      pctText.setAttribute("y", p.y*0.7 - markerSize / 2 - 4);
      pctText.setAttribute("font-size", fontSizeValue);
      pctText.setAttribute("class", "bar-label-hc-suffic");
      pctText.textContent = `${Math.round(p.pct)}%`;
      svg.appendChild(pctText);
    });
  }

  // ---- baseline axis line ----
  const axisLine = document.createElementNS(ns, "line");
  axisLine.setAttribute("x1", plotLeft);
  axisLine.setAttribute("x2", width - paddingRight);
  axisLine.setAttribute("y1", baseline);
  axisLine.setAttribute("y2", baseline);
  axisLine.setAttribute("stroke", "currentColor");
  axisLine.setAttribute("stroke-opacity", 0.3);
  svg.appendChild(axisLine);
}

let resizeTimerHC;
const hcContainer = document.getElementById("headcount-chart").parentElement;
const roHC = new ResizeObserver(() => {
  clearTimeout(resizeTimerHC);
  resizeTimerHC = setTimeout(() => {
    render_headcount_chart(headcount_data);
  }, 150);
});
roHC.observe(hcContainer);
render_headcount_chart(headcount_data);

///////////////////////////////////////////////////////////////
//////// график по финансам
////////////////////////////////////////////////////////////

function render_cost_overrun_chart(data, options = {}) {
  const projects = data.projects;
  const svg = document.getElementById("cost-chart");
  const containerWidth = svg.parentElement.clientWidth;
  const containerHeight = svg.parentElement.clientHeight;   // NEW
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const width = options.width || containerWidth;             
  const height = options.height || containerHeight;           

  if (!projects || projects.length === 0) {
    console.warn('no data');
    return;
  }

  // ---- colors ----
  const colorContract = proj_colors.ColorPlan2 || "#a9b4c2";
  const colorExpertise = proj_colors.ColorFact || "#5b6b84";
  const colorForecast = proj_colors.ColorPlan || "#1e88ff";
  const colorExcessForecast = proj_colors.ColorExcessForecast || "#f2a3a3";
  const colorExcessFact = proj_colors.ColorExcessFact || "#c0392b";
  const colorDashLine = proj_colors.ColorDashLine || "#e03131";
  const colorSurplus = proj_colors.ColorSurplusForecast || "#7AB67A";
  const colorSurplusTxt = proj_colors.ColorOnTime || "#228B22";

  // ---- horizontal factors: still width-driven ----
  const paddingLeft = clamp(width * 0.01, 8, 16);
  const paddingRight = clamp(width * 0.02, 20, 50);
  const gap_label = clamp(width * 0.4, 50, 80);
  const cornerRadius = clamp(width * 0.008, 3, 4);

  const ns = "http://www.w3.org/2000/svg";
  const plotLeft = paddingLeft + gap_label;
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

  // ---- derive excess/profit figures per project ----
  const parsed = projects.map(p => {
    const totalExcess = Math.max(0, (p.forecast_sum || 0) - (p.expertise_sum || 0));
    const factExcess = Math.min(p.fact_excess || 0, totalExcess);
    const forecastOnlyExcess = totalExcess - factExcess;
    const totalProf = Math.max(0, (p.expertise_sum || 0) - (p.forecast_sum || 0));
    return { ...p, totalExcess, factExcess, forecastOnlyExcess, totalProf };
  });

  // ---- shared horizontal scale ----
  const maxValue = Math.max(...parsed.flatMap(p => [p.contract_sum || 0, p.expertise_sum || 0, p.forecast_sum || 0]));
  const mainMaxWidth = (width - plotLeft - paddingRight) * 0.76;
  const scale = mainMaxWidth / maxValue;

  // ---- legend: measure + assign rows BEFORE any vertical layout depends on it ----
      const legendItems = [
      { color: colorContract, label: "Контрактная стоимость"},
      { color: colorExpertise, label: "После экспертизы"},
      { color: colorForecast, label: "Прогноз стоимости"},
      { color: colorSurplus, label: "Прибыль прогноз"},
      // { color: colorExcessFact, label: "Убыток факт"},
      { color: colorExcessForecast, label: "Убыток прогноз"}
      ];

  const fontSizeLabel = clamp(Math.min(width, height) * 0.045, 9, 14);
  const fontSizeValue = clamp(Math.min(width, height) * 0.030, 8, 13);
  const legendSize = clamp(height * 0.045, 9, 14);

  const legendItemWidths = legendItems.map(item =>
    legendSize + 5 + item.label.length * fontSizeLabel * 0.76 + 18
  );
  const legendAvailableWidth = width - paddingLeft - paddingRight;

  const legendRowAssignments = [];
  let legendRow = 0;
  let rowUsedWidth = 0;
  legendItemWidths.forEach((w) => {
    if (rowUsedWidth + w > legendAvailableWidth && rowUsedWidth > 0) {
      legendRow++;
      rowUsedWidth = 0;
    }
    legendRowAssignments.push(legendRow);
    rowUsedWidth += w;
  });
  const legendRowCount = legendRow + 1;

  const legendLineHeight = legendSize + clamp(height * 0.03, 6, 14);
  const legendRowHeight = legendLineHeight * legendRowCount;

  // ---- vertical factors: now height-driven, not width-driven ----
  const paddingTop = legendRowHeight + clamp(height * 0.04, 10, 22);
  const paddingBottom = clamp(height * 0.012, 2, 10);

  const n = parsed.length;
  const availableRowSpace = height - paddingTop - paddingBottom;
  const rowGap = availableRowSpace / n;               // total vertical budget per project group
  const barHeight = clamp(rowGap * 0.22, 6, 20);       // each of the 3 bars' thickness
  const barGapY = clamp(rowGap * 0.04, 2, 8);          // gap between the 3 stacked bars within a group
  const groupHeight = barHeight * 3 + barGapY * 2;
  const groupGap = rowGap - groupHeight;                // remaining space = gap between project groups

  // height is no longer computed — it IS containerHeight already

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");     // NEW
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.innerHTML = "";   // MOVED — now clears before anything is drawn, not after the legend was built

  // ---- draw legend, using precomputed row assignments ----
  let legendX = paddingLeft;
  let currentRow = 0;
  legendItems.forEach((item, i) => {
    const row = legendRowAssignments[i];
    if (row !== currentRow) {
      legendX = paddingLeft;
      currentRow = row;
    }
    const legendY = row * legendLineHeight + (legendLineHeight - legendSize) / 2;

    const swatch = document.createElementNS(ns, "rect");
    swatch.setAttribute("x", legendX);
    swatch.setAttribute("y", legendY);
    swatch.setAttribute("width", legendSize);
    swatch.setAttribute("height", legendSize);
    swatch.setAttribute("rx", cornerRadius * 0.6);
    swatch.setAttribute("fill", item.color);
    svg.appendChild(swatch);

    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", legendX + legendSize * 1.4 + 5);
    text.setAttribute("y", legendY + legendSize * 0.85);
    text.setAttribute("class", "legend-label");
    text.setAttribute("font-size", fontSizeLabel);
    text.textContent = item.label;
    svg.appendChild(text);

    legendX += legendItemWidths[i];
  });

  // ---- rows ----
  parsed.forEach((project, i) => {
    const groupTop = paddingTop + i * rowGap;    // NEW — was i * (groupHeight + groupGap)
    const expert_forw = Math.min(project.forecast_sum || 0, project.expertise_sum || 0);

    const rows = [
      { value: project.contract_sum || 0, text_value: project.contract_sum || 0, color: colorContract, y: groupTop },
      { value: expert_forw || 0, text_value: project.expertise_sum || 0, color: colorExpertise, y: groupTop + barHeight + barGapY },
      { value: expert_forw || 0, text_value: project.forecast_sum || 0, color: colorForecast, y: groupTop + (barHeight + barGapY) * 2 }
    ];

    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", plotLeft);
    label.setAttribute("y", groupTop - 4);
    label.setAttribute("class", "bar-label_completion");
    label.setAttribute("font-size", fontSizeLabel);
    label.setAttribute("font-weight", "600");
    label.textContent = project.project || "—";
    svg.appendChild(label);

    rows.forEach(row => {
      const barW = row.value * scale;
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", plotLeft);
      rect.setAttribute("y", row.y);
      rect.setAttribute("width", barW);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("rx", cornerRadius);
      rect.setAttribute("fill", row.color);
      svg.appendChild(rect);

      const valueText = document.createElementNS(ns, "text");
      valueText.setAttribute("x", plotLeft + barW - 10);
      valueText.setAttribute("y", row.y + barHeight / 2 + fontSizeValue / 3);
      valueText.setAttribute("text-anchor", "end");
      valueText.setAttribute("font-size", fontSizeValue);
      valueText.setAttribute("fill", "white");
      valueText.setAttribute("font-weight", "600");
      valueText.textContent = fmt(row.text_value);
      svg.appendChild(valueText);
    });

    const profRow = rows[1];
    const profY = profRow.y;
    const profStartX = plotLeft + (project.forecast_sum || 0) * scale;
    if (project.forecast_sum < project.expertise_sum) {
      const profitW = (project.expertise_sum - project.forecast_sum) * scale;

      const dashProfine = document.createElementNS(ns, "line");
      dashProfine.setAttribute("x1", profStartX);
      dashProfine.setAttribute("x2", profStartX);
      dashProfine.setAttribute("y1", groupTop - 4);
      dashProfine.setAttribute("y2", groupTop + groupHeight + 4);
      dashProfine.setAttribute("stroke", colorSurplusTxt);
      dashProfine.setAttribute("stroke-width", 1.5);
      dashProfine.setAttribute("stroke-dasharray", "5,4");
      svg.appendChild(dashProfine);

      const profRect = document.createElementNS(ns, "rect");
      profRect.setAttribute("x", profStartX);
      profRect.setAttribute("y", profY);
      profRect.setAttribute("width", profitW);
      profRect.setAttribute("height", barHeight);
      profRect.setAttribute("rx", cornerRadius);
      profRect.setAttribute("fill", colorSurplus);
      svg.appendChild(profRect);

      const profLabel = document.createElementNS(ns, "text");
      profLabel.setAttribute("x", profStartX + profitW + 10);
      profLabel.setAttribute("y", profY + barHeight / 2 + fontSizeValue / 3);
      profLabel.setAttribute("font-size", fontSizeValue);
      profLabel.setAttribute("font-weight", "700");
      profLabel.setAttribute("fill", colorSurplusTxt);
      profLabel.textContent = `+ ${fmt(project.totalProf)}`;
      svg.appendChild(profLabel);
    }

    if (project.totalExcess > 0) {
      const forecastRow = rows[2];
      const excessStartX = plotLeft + (project.expertise_sum || 0) * scale;
      const excessY = forecastRow.y;

      const dashLine = document.createElementNS(ns, "line");
      dashLine.setAttribute("x1", excessStartX);
      dashLine.setAttribute("x2", excessStartX);
      dashLine.setAttribute("y1", groupTop - 4);
      dashLine.setAttribute("y2", groupTop + groupHeight + 4);
      dashLine.setAttribute("stroke", colorDashLine);
      dashLine.setAttribute("stroke-width", 1.5);
      dashLine.setAttribute("stroke-dasharray", "5,4");
      svg.appendChild(dashLine);

      let cursorX = excessStartX;
      if (project.factExcess > 0) {
        const factW = project.factExcess * scale;
        const factRect = document.createElementNS(ns, "rect");
        factRect.setAttribute("x", cursorX);
        factRect.setAttribute("y", excessY);
        factRect.setAttribute("width", factW);
        factRect.setAttribute("height", barHeight);
        factRect.setAttribute("fill", colorExcessFact);
        svg.appendChild(factRect);
        cursorX += factW;
      }

      if (project.forecastOnlyExcess > 0) {
        const foreW = project.forecastOnlyExcess * scale;
        const foreRect = document.createElementNS(ns, "rect");
        foreRect.setAttribute("x", cursorX);
        foreRect.setAttribute("y", excessY);
        foreRect.setAttribute("width", foreW);
        foreRect.setAttribute("height", barHeight);
        foreRect.setAttribute("rx", cornerRadius * 0.5);
        foreRect.setAttribute("fill", colorExcessForecast);
        svg.appendChild(foreRect);
        cursorX += foreW;
      }

      const excessLabel = document.createElementNS(ns, "text");
      excessLabel.setAttribute("x", cursorX + 10);
      excessLabel.setAttribute("y", excessY + barHeight / 2 + fontSizeValue / 3);
      excessLabel.setAttribute("font-size", fontSizeValue);
      excessLabel.setAttribute("font-weight", "700");
      excessLabel.setAttribute("fill", colorDashLine);
      excessLabel.textContent = `- ${fmt(project.totalExcess)}`;
      svg.appendChild(excessLabel);
    }
  });

  // ---- summary card: total fact loss across all projects ----
const totalFactLoss = parsed.reduce((sum, p) => sum + (p.factExcess || 0), 0);

if (totalFactLoss > 0) {
    const cardPadding = clamp(Math.min(width, height) * 0.03, 8, 12);
    const cardFontLabel = clamp(fontSizeLabel * 0.95, 8, 13);
    const cardFontValue = clamp(fontSizeValue , 12, 18);
    const cardLabelText = "общий убыток по законченным строительством объектам:";

    // rough width estimate for the label (wraps to 2 lines if needed) and value
    const charWidth = cardFontLabel * 0.56;
    const maxCardWidth = clamp(width * 0.32, 60, 140);
    const cardInnerWidth = maxCardWidth - cardPadding * 2;

    // simple word-wrap for the label into lines that fit cardInnerWidth
    const words = cardLabelText.split(" ");
    const labelLines = [];
    let currentLine = "";
    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length * charWidth > cardInnerWidth && currentLine) {
            labelLines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    if (currentLine) labelLines.push(currentLine);

    const lineHeight = cardFontLabel * 1.35;
    const labelBlockHeight = labelLines.length * lineHeight;
    const cardHeight = cardPadding * 2 + labelBlockHeight + cardFontValue + 6;
    const cardWidth = maxCardWidth;

    const cardX = width - paddingRight - cardWidth;
    const cardY = height - paddingBottom - cardHeight;

    // dashed dark-red frame
    const cardRect = document.createElementNS(ns, "rect");
    cardRect.setAttribute("x", cardX);
    cardRect.setAttribute("y", cardY);
    cardRect.setAttribute("width", cardWidth);
    cardRect.setAttribute("height", cardHeight);
    cardRect.setAttribute("rx", cornerRadius);
    cardRect.setAttribute("fill", "none");
    cardRect.setAttribute("stroke", colorExcessFact);
    cardRect.setAttribute("stroke-width", 1.5);
    cardRect.setAttribute("stroke-dasharray", "5,4");
    svg.appendChild(cardRect);

    const swatch = document.createElementNS(ns, "rect");
    swatch.setAttribute("x", cardX);
    swatch.setAttribute("y", cardY);
    swatch.setAttribute("width", legendSize);
    swatch.setAttribute("height", legendSize);
    swatch.setAttribute("rx", cornerRadius * 0.6);
    swatch.setAttribute("fill", colorExcessFact);
    svg.appendChild(swatch);

    // label (wrapped lines)
    labelLines.forEach((line, idx) => {
        const labelText = document.createElementNS(ns, "text");
        labelText.setAttribute("x", cardX + cardPadding);
        labelText.setAttribute("y", cardY + cardPadding + cardFontLabel + idx * lineHeight);
        labelText.setAttribute("font-size", cardFontLabel);
        labelText.setAttribute("fill", colorExcessFact);
        labelText.textContent = line;
        svg.appendChild(labelText);
    });

    // total value, below the label
    const valueText = document.createElementNS(ns, "text");
    valueText.setAttribute("x", cardX + cardPadding);
    valueText.setAttribute("y", cardY + cardPadding + labelBlockHeight + cardFontValue);
    valueText.setAttribute("font-size", cardFontValue);
    valueText.setAttribute("font-weight", "700");
    valueText.setAttribute("fill", colorExcessFact);
    valueText.textContent = fmt(totalFactLoss);
    svg.appendChild(valueText);
  }
}

let resizeTimerCost;
const costContainer = document.getElementById("cost-chart").parentElement;
const roCost = new ResizeObserver(() => {
  clearTimeout(resizeTimerCost);
  resizeTimerCost = setTimeout(() => {
    render_cost_overrun_chart(cost_data);
  }, 150);
});
roCost.observe(costContainer);
render_cost_overrun_chart(cost_data);
////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// функция для добавления графика по отчету по выполнению и актированию
/////////////////////////////////////////////////////////////////////////////////////////
function render_act_chart(data, options = {}) {
  const projects = data.projects;
  const svg = document.getElementById("act-chart");
  const containerWidth = svg.parentElement.clientWidth;
  const containerHeight = svg.parentElement.clientHeight;   // NEW
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  const width = options.width || containerWidth;
  const height = options.height || containerHeight;          // NEW — trust the container

  if (!projects || projects.length === 0) {
    console.warn('no data');
    return;
  }

  // ---- colors ----
  const colorAct = proj_colors.ColorPlan2 || "#a9b4c2";
  const colorWIP = proj_colors.ColorFact || "#5b6b84";
  const colorDue = proj_colors.ColorForecast2 || "#8DACCD";
  const colorTxt = "White" || "#228B22";

  // ---- horizontal factors: still width-driven ----
  const paddingLeft = clamp(width * 0.01, 8, 16);
  const paddingRight = clamp(width * 0.02, 20, 50);
  const gap_label = clamp(width * 0.4, 50, 80);
  const cornerRadius = clamp(width * 0.008, 3, 4);

  // ---- vertical factors: now height-driven, not width-driven ----
  const n = projects.length;
  const legendSize = clamp(height * 0.06, 9, 14);
  const legendRowHeight = legendSize + clamp(height * 0.08, 12, 24);
  const paddingTop = legendRowHeight + clamp(height * 0.05, 10, 20);
  const paddingBottom = clamp(height * 0.03, 4, 12);

  const fontSizeLabel = clamp(Math.min(width, height) * 0.045, 9, 14);
  const fontSizeValue = clamp(Math.min(width, height) * 0.05, 10, 16);
  // const fontSizeValue = clamp(Math.min(width, height) * 0.05, 10, 16);

  const availableRowSpace = height - paddingTop - paddingBottom;
  const rowGap = availableRowSpace / n;              // total vertical budget per project row
  const barHeight = clamp(rowGap * 0.55, 14, 40);     // bar thickness is a slice of that budget
  const barGapY = clamp(rowGap * 0.06, 2, 8);         // (kept for compatibility, unused in single-row layout)
  const groupGap = rowGap - barHeight;                 // remaining space = gap between rows

  const ns = "http://www.w3.org/2000/svg";
  const plotLeft = paddingLeft + gap_label;
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

  const parsed = projects.map(p => {
    const totalDue = Math.max(0, (p.expertise_sum || 0) - (p.act_sum || 0) - (p.wip_sum || 0));
    const totalCost = Math.max(0, (p.expertise_sum || 0));
    return { ...p, totalDue, totalCost };
  });
  const maxValue = Math.max(...parsed.flatMap(p => p.totalCost || 0));
  const mainMaxWidth = (width - plotLeft - paddingRight);
  const scale = mainMaxWidth / maxValue;
  const groupHeight = barHeight + barGapY;   // (kept for compatibility; not used to derive height anymore)

  // height is no longer computed here — it IS containerHeight already

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");   // NEW
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.innerHTML = "";

  // ---- legend ----
  const legendY = (legendRowHeight - legendSize) / 2;
  const legendItems = [
    { color: colorAct, label: "заактировано" },
    { color: colorWIP, label: "незавершенное производство" },
    { color: colorDue, label: "не выполнено" }
  ];
  let legendX = paddingLeft;
  legendItems.forEach(item => {
    const swatch = document.createElementNS(ns, "rect");
    swatch.setAttribute("x", legendX);
    swatch.setAttribute("y", legendY);
    swatch.setAttribute("width", legendSize);
    swatch.setAttribute("height", legendSize);
    swatch.setAttribute("rx", cornerRadius * 0.6);
    swatch.setAttribute("fill", item.color);
    svg.appendChild(swatch);

    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", legendX + legendSize * 1.4 + 5);
    text.setAttribute("y", legendY + legendSize * 0.85);
    text.setAttribute("class", "legend-label");
    text.setAttribute("font-size", fontSizeLabel);
    text.textContent = item.label;
    svg.appendChild(text);

    legendX += legendSize + 5 + item.label.length * fontSizeLabel * 0.76 + 18;
  });

  // ---- rows ----
  parsed.forEach((project, i) => {
    const groupTop = paddingTop + i * rowGap;    // NEW — was i * (groupHeight + groupGap)
    const excessStartX = plotLeft + (project.act_sum || 0) * scale;
    let cursorX = excessStartX;
    const actW = project.act_sum * scale;
    const wipW = project.wip_sum * scale;
    const due_sum_ch = Math.max(0, (project.expertise_sum || 0) - (project.act_sum || 0) - (project.wip_sum || 0));
    const dueW = due_sum_ch * scale;

    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", paddingLeft);
    label.setAttribute("y", groupTop + barHeight / 2);
    label.setAttribute("class", "term-y-label");
    label.setAttribute("font-size", fontSizeLabel);
    label.setAttribute("font-weight", "600");
    label.textContent = project.project || "—";
    svg.appendChild(label);

    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", plotLeft);
    rect.setAttribute("y", groupTop);
    rect.setAttribute("width", actW);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("rx", cornerRadius);
    rect.setAttribute("fill", colorAct);
    svg.appendChild(rect);

    const wipRect = document.createElementNS(ns, "rect");
    wipRect.setAttribute("x", excessStartX);
    wipRect.setAttribute("y", groupTop);
    wipRect.setAttribute("width", wipW);
    wipRect.setAttribute("height", barHeight);
    wipRect.setAttribute("rx", cornerRadius);
    wipRect.setAttribute("fill", colorWIP);
    svg.appendChild(wipRect);
    cursorX += wipW;

    const dueRect = document.createElementNS(ns, "rect");
    dueRect.setAttribute("x", cursorX);
    dueRect.setAttribute("y", groupTop);
    dueRect.setAttribute("width", dueW);
    dueRect.setAttribute("height", barHeight);
    dueRect.setAttribute("rx", cornerRadius);
    dueRect.setAttribute("fill", colorDue);
    svg.appendChild(dueRect);

    const actText = document.createElementNS(ns, "text");
    actText.setAttribute("x", plotLeft + actW / 2);
    actText.setAttribute("y", groupTop + barHeight / 2 + fontSizeValue / 3);
    actText.setAttribute("text-anchor", "middle");
    actText.setAttribute("font-size", fontSizeValue);
    actText.setAttribute("fill", "white");
    actText.setAttribute("font-weight", "600");
    actText.textContent = fmt(project.act_sum);
    svg.appendChild(actText);

    const wipText = document.createElementNS(ns, "text");
    wipText.setAttribute("x", excessStartX + wipW / 2);
    wipText.setAttribute("y", groupTop + barHeight / 2 + fontSizeValue / 3);
    wipText.setAttribute("text-anchor", "middle");
    wipText.setAttribute("font-size", fontSizeValue);
    wipText.setAttribute("fill", "white");
    wipText.setAttribute("font-weight", "600");
    wipText.textContent = fmt(project.wip_sum);
    svg.appendChild(wipText);

    const dueText = document.createElementNS(ns, "text");
    dueText.setAttribute("x", cursorX + dueW / 2);
    dueText.setAttribute("y", groupTop + barHeight / 2 + fontSizeValue / 3);
    dueText.setAttribute("text-anchor", "middle");
    dueText.setAttribute("font-size", fontSizeValue);
    dueText.setAttribute("fill", "white");
    dueText.setAttribute("font-weight", "600");
    dueText.textContent = fmt(due_sum_ch);
    svg.appendChild(dueText);
  });
}


let resizeTimerAct;
const actContainer = document.getElementById("act-chart").parentElement;
const roAct = new ResizeObserver(() => {
  clearTimeout(resizeTimerAct);
  resizeTimerAct = setTimeout(() => {
    render_act_chart(act_data);
  }, 150);
});
roAct.observe(costContainer);
render_act_chart(act_data);