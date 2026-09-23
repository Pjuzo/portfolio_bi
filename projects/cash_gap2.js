// Chart зависимость: Chart.js 4.x убрать или оставить?

const DATA = {

  "weeks": [

  "нед 1", "нед 2", "нед 3", "нед 4", "нед 5", "нед 6",

  "нед 7", "нед 8", "нед 9", "нед 10", "нед 11", "нед 12", "нед 13", "нед 14"

  ],

  "raw": [

      {

      "ar": [

        ["Заказчик А", 22000],

        ["Заказчик Б", 28000],

        ["Заказчик В", 18000]

      ],

      "ap": [

        ["Поставщик А", 26000],

        ["ФОТ", 18000],

        ["Налоги", 9000],

        ["Оборудование", 7000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 16000],

        ["Заказчик Б", 20000],

        ["Заказчик В", 15000]

      ],

      "ap": [

        ["Поставщик А", 30000],

        ["ФОТ", 18000],

        ["Налоги", 0],

        ["Оборудование", 10000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 30000],

        ["Заказчик Б", 24000],

        ["Заказчик В", 22000]

      ],

      "ap": [

        ["Поставщик А", 34000],

        ["ФОТ", 19000],

        ["Налоги", 12000],

        ["Оборудование", 6000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 28000],

        ["Заказчик Б", 18000],

        ["Заказчик В", 20000]

      ],

      "ap": [

        ["Поставщик А", 38000],

        ["ФОТ", 19000],

        ["Налоги", 0],

        ["Оборудование", 12000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 24000],

        ["Заказчик Б", 16000],

        ["Заказчик В", 17000]

      ],

      "ap": [

        ["Поставщик А", 42000],

        ["ФОТ", 20000],

        ["Налоги", 14000],

        ["Оборудование", 10000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 26000],

        ["Заказчик Б", 17000],

        ["Заказчик В", 19000]

      ],

      "ap": [

        ["Поставщик А", 39000],

        ["ФОТ", 20000],

        ["Налоги", 0],

        ["Оборудование", 9000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 24000],

        ["Заказчик Б", 9000],

        ["Заказчик В", 21000]

      ],

      "ap": [

        ["Поставщик А", 36000],

        ["ФОТ", 21000],

        ["Налоги", 15000],

        ["Оборудование", 8000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 19000],

        ["Заказчик Б", 22000],

        ["Заказчик В", 24000]

      ],

      "ap": [

        ["Поставщик А", 33000],

        ["ФОТ", 21000],

        ["Налоги", 0],

        ["Оборудование", 7000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 22000],

        ["Заказчик Б", 16000],

        ["Заказчик В", 22000]

      ],

      "ap": [

        ["Поставщик А", 11000],

        ["ФОТ", 22000],

        ["Налоги", 16000],

        ["Оборудование", 9000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 16000],

        ["Заказчик Б", 29000],

        ["Заказчик В", 25000]

      ],

      "ap": [

        ["Поставщик А", 30000],

        ["ФОТ", 22000],

        ["Налоги", 0],

        ["Оборудование", 8000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 18000],

        ["Заказчик Б", 21000],

        ["Заказчик В", 26000]

      ],

      "ap": [

        ["Поставщик А", 29000],

        ["ФОТ", 23000],

        ["Налоги", 17000],

        ["Оборудование", 7000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 21000],

        ["Заказчик Б", 33000],

        ["Заказчик В", 17000]

      ],

      "ap": [

        ["Поставщик А", 28000],

        ["ФОТ", 23000],

        ["Налоги", 0],

        ["Оборудование", 7000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 34000],

        ["Заказчик Б", 15000],

        ["Заказчик В", 28000]

      ],

      "ap": [

        ["Поставщик А", 27000],

        ["ФОТ", 24000],

        ["Налоги", 18000],

        ["Оборудование", 6000]

      ]

      },

      {

      "ar": [

        ["Заказчик А", 14000],

        ["Заказчик Б", 25000],

        ["Заказчик В", 8000]

      ],

      "ap": [

        ["Поставщик А", 17000],

        ["ФОТ", 14000],

        ["Налоги", 0],

        ["Оборудование", 10000]

      ]

      }

    ]

  };

   

  /// обновление графика

  let chartInstance = null;

  // let chartInstance_pre = null;

  ///// окончание вставки

  // ---------------------------------------------------------

  // сценарии для примера задаются коэффициентами

  // ---------------------------------------------------------

  const SCENARIO_FACTORS = {

    Основной: {

      ar: 1.00,

      ap: 1.00

    },

    Оптимистичный: {

      ar: 1.15,

      ap: 0.93

    },

    Пессимистичный: {

      ar: 0.80,

      ap: 1.10

    }

  };

  // ---------------------------------------------------------

  // GLOBAL

  // ---------------------------------------------------------

  let chart = null;

  let selectedWeekIndex = 0;

 

  const $ = (id) => document.getElementById(id);

  const RUB = (value) =>

  new Intl.NumberFormat("ru-RU", {

      style: "currency",

      currency: "RUB",

      maximumFractionDigits: 0

    }).format(value);

   

   

  // ---------------------------------------------------------

  // Начальные установки

  // ---------------------------------------------------------

   

const chart_colors={

  ar:'rgba(34, 139, 34, 0.85)',

  // ap:'rgba(220, 80, 80, 0.85)',

  ap:'rgba(227, 26, 28, 0.85)',

  // ar:'#228B22',

  // ap:'#e31a1c',

  cash:'#007FFF',

  negative: '#e31a1c',

  text_color: '#3E5F8A'

 

}

 

  function getSettings() {

  return {

    scenario: document.getElementById('scenario').value,

    opening: Number(document.getElementById('opening').value),

    horizon: Number(document.getElementById('horizon').value)|| 14

  };

  }

 

     

  // ---------------------------------------------------------

  // расчет прогноза

  // ---------------------------------------------------------

  function calculateForecast() {

  const { scenario, opening, horizon } = getSettings();

  const factors = SCENARIO_FACTORS[scenario];

  let cash = opening;

  // let cash = openingCashValue;

  const forecast =

    DATA.raw

    .slice(0, horizon)

    .map((week, index) => {

          const ar = week.ar.reduce((sum, item) => sum + item[1], 0) * factors.ar;

          const ap = week.ap.reduce((sum, item) => sum + item[1], 0) * factors.ap;

          const net = ar - ap;

          const openingCash = cash;

          cash += net;

          return {

            index,

            week:

            DATA.weeks[index],

            ar,

            ap,

            net,

            openingCash,

            cash

          };

    });

    return {

      forecast,

      factors,

      opening

    };

  }

   

  //// изменим размер графика

  function resizeCanvasToContainer(canvasId) {

    const canvas = document.getElementById(canvasId);

    const container = canvas.parentElement;

    const dpr = window.devicePixelRatio || 1;

   

    const cssWidth = container.clientWidth;

    const cssHeight = container.clientHeight;

   

    // actual pixel buffer (crisp on retina/high-DPI screens)

    canvas.width = cssWidth * dpr;

    canvas.height = cssHeight * dpr;

   

    // CSS size stays as the container's size

    canvas.style.width = cssWidth + 'px';

    canvas.style.height = cssHeight + 'px';

   

    const ctx = canvas.getContext('2d');

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing ops to match dpr

  }

   

  resizeCanvasToContainer('cashGapChart')

  // ---------------------------------------------------------

  // KPI карточки

  // ---------------------------------------------------------

  function renderKpis(forecast, opening) {

    const minCash =  Math.min(

      ...forecast.map(x => x.cash));

    const maximumGap = Math.max(0, -minCash);

    const gapWeek = forecast.find(x => x.cash < 0);

   

    $("kpis").innerHTML = [

      ["Остаток на начало", RUB(opening), ""],

      ["Минимальный остаток", RUB(minCash), minCash < 0 ? "danger" : "good"],

      // ["Максимальный дефицит", RUB(maximumGap), maximumGap ? "danger" : "good"],

      ["Требуемое финансирование", RUB(maximumGap), maximumGap ? "danger" : "good"],

      ["Начало дефицита", gapWeek ? gapWeek.week : "No gap", gapWeek ? "danger" : "good"]

      ]

    .map( ([label, value, cls ]) => `

      <div class="kpi">

        <div class="l">

          ${label}

        </div>

        <div class="v ${cls}">

          ${value}

        </div>

      </div>

      `

      )

      .join("");

  }

   

  // ---- persistent state for redraw + hover ----

  const cashGapChartState = {forecast: null, canvasId: 'cashGapChart', layout: null, hoverIndex: null};

   

  function render_cash_gap_chart(forecast, canvasId = 'cashGapChart') {

    cashGapChartState.forecast = forecast;

    cashGapChartState.canvasId = canvasId;

    cashGapChartState.hoverIndex = null;

   

    drawChart();

    attachHoverInteraction(canvasId);

    }

   

  function drawChart() {

    const { forecast, canvasId, hoverIndex } = cashGapChartState;

    const canvas = document.getElementById(canvasId);

    const ctx = canvas.getContext('2d');

    const W = canvas.clientWidth;

    const H = canvas.clientHeight;

   

    ctx.clearRect(0, 0, W, H);

   

    const padding = { top: 20, right: 20, bottom: 20, left: 60 };

    const chartW = W - padding.left - padding.right;

    const chartH = H - padding.top - padding.bottom;

    const n = forecast.length;

    console.log('периоды прогноза: ', n);

    console.log('общая ширина окна: ', W);

    console.log('Ширина графика: ', chartW);

    if (n === 0) return;

   

    const allValues = forecast.flatMap(f => [f.ar, f.ap, f.cash]);

    const maxVal = Math.max(0, ...allValues);

    const minVal = Math.min(0, ...allValues);

    const range = maxVal - minVal || 1;

   

    const yToPx = (v) => padding.top + chartH - ((v - minVal) / range) * chartH;

    const groupW = chartW / n;

    const barW = groupW * 0.32;

    const zeroY = yToPx(0);

   

    // save layout for hit-testing on mousemove

    cashGapChartState.layout = { padding, groupW, chartW, chartH, n, yToPx };

   

    // gridlines + y labels

    // ctx.class = "ctx_lines";

    // ctx.setAttribute("class", "ctx_lines");

    ctx.strokeStyle = '#e0e0e0';

    ctx.fillStyle = '#555';

    ctx.font = '11px arial';

    ctx.textAlign = 'right';

    ctx.textBaseline = 'middle';

    const ySteps = 5;

    for (let i = 0; i <= ySteps; i++) {

      const v = minVal + (range * i) / ySteps;

      const y = yToPx(v);

      ctx.beginPath();

      ctx.moveTo(padding.left, y);

      ctx.lineTo(W - padding.right, y);

      ctx.stroke();

      ctx.fillText( Math.round(v).toLocaleString(), padding.left - 8, y);

    }

   

    // hover highlight (vertical band), drawn before bars so bars sit on top

    if (hoverIndex !== null) {

      const groupX = padding.left + hoverIndex * groupW;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';

      ctx.fillRect(groupX, padding.top, groupW, chartH);

    }

   

    // bars

    forecast.forEach((f, i) => {

      const groupX = padding.left + i * groupW;

      const emphasize = hoverIndex === i;

     

      const arX = groupX + groupW / 2 - barW - 2;

      const arY = yToPx(Math.max(f.ar, 0));

      const arH = Math.abs(yToPx(f.ar) - zeroY);

      ctx.fillStyle=chart_colors.ar

      ctx.globalAlpha =  emphasize ? 1 : 0.85;

      // ctx.fillStyle = emphasize ? 'rgba(75, 192, 120, 1)' : 'rgba(75, 192, 120, 0.85)';

      ctx.fillRect(arX, f.ar >= 0 ? arY : zeroY, barW, arH);

     

      const apX = groupX + groupW / 2 + 2;

      const apY = yToPx(Math.max(f.ap, 0));

      const apH = Math.abs(yToPx(f.ap) - zeroY);

      ctx.fillStyle=chart_colors.ap

      ctx.globalAlpha =  emphasize ? 1 : 0.85;

      // ctx.fillStyle = emphasize ? 'rgba(220, 80, 80, 1)' : 'rgba(220, 80, 80, 0.85)';

      ctx.fillRect(apX, f.ap >= 0 ? apY : zeroY, barW, apH);

     

      ctx.fillStyle = emphasize ? '#000' : '#333';

      ctx.font = emphasize ? 'bold 11px arial' : '11px arial';

      ctx.textAlign = 'center';

      ctx.textBaseline = 'top';

      ctx.fillText(f.week, groupX + groupW / 2, H - padding.bottom + 8);

    });

   

    // zero cash line

    ctx.save();

    ctx.strokeStyle = '#e31a1c';

    // ctx.fill='rgb(220, 54, 65)';

    ctx.lineWidth = 2;

    ctx.setLineDash([15,5]);

    ctx.beginPath();

    ctx.moveTo(padding.left, zeroY);

    ctx.lineTo(padding.left+chartW, zeroY);

    ctx.stroke();

    ctx.restore();

 

    // cash line

    ctx.lineWidth = 2;

    for (let i = 0; i < forecast.length - 1; i++) {

      const f1 = forecast[i];

      const f2 = forecast[i + 1];

 

      const x1 = padding.left + i * groupW + groupW / 2;

      const y1 = yToPx(f1.cash);

      const x2 = padding.left + (i + 1) * groupW + groupW / 2;

      const y2 = yToPx(f2.cash);

 

      const crosses = (f1.cash < 0) !== (f2.cash < 0);

 

      if (!crosses) {

        // whole segment is one color

        ctx.strokeStyle = f1.cash < 0 ? chart_colors.negative: chart_colors.cash;

        ctx.beginPath();

        ctx.moveTo(x1, y1);

        ctx.lineTo(x2, y2);

        ctx.stroke();

      } else {

        // find the crossing point (where cash value = 0) via linear interpolation

        const t = (0 - f1.cash) / (f2.cash - f1.cash); // fraction along the segment

        const xCross = x1 + (x2 - x1) * t;

        const yCross = zeroY;

 

        // first half

        ctx.strokeStyle = f1.cash < 0 ? chart_colors.negative: chart_colors.cash;

        ctx.beginPath();

        ctx.moveTo(x1, y1);

        ctx.lineTo(xCross, yCross);

        ctx.stroke();

 

        // second half

        ctx.strokeStyle = f2.cash < 0 ? chart_colors.negative: chart_colors.cash;

        ctx.beginPath();

        ctx.moveTo(xCross, yCross);

        ctx.lineTo(x2, y2);

        ctx.stroke();

      }

    }

 

    // // const lineColor= f.cash <0 ? chart_colors.negative: chart_colors.cash;

    // ctx.strokeStyle = chart_colors.cash;

    // ctx.lineWidth = 2;

    // ctx.beginPath();

    // forecast.forEach((f, i) => {

    //   const x = padding.left + i * groupW + groupW / 2;

    //   const y = yToPx(f.cash);

    //   if (i === 0) ctx.moveTo(x, y);

    //   else ctx.lineTo(x, y);

    // });

    // ctx.stroke();

   

    // cash points

    forecast.forEach((f, i) => {

      const x = padding.left + i * groupW + groupW / 2;

      const y = yToPx(f.cash);

      const emphasize = hoverIndex === i;

      const r = emphasize ? 7 : 4;

      const pointColor= f.cash<0 ? chart_colors.negative: chart_colors.cash;

     

      const clampedX = Math.min(x, W - r);

   

      ctx.fillStyle = 'transparent';

      ctx.strokeStyle = pointColor;

      // ctx.stroke();

      ctx.beginPath();

      ctx.arc(clampedX, y, r, 0, Math.PI * 2);

      ctx.fill();

      ctx.stroke();

      if (emphasize) {

        ctx.strokeStyle = chart_colors.cash;

        ctx.lineWidth = 1.5;

        ctx.stroke();

      }

    });

   

    // forecast.forEach((f, i) => {

    //   const x = padding.left + i * groupW + groupW / 2;

    //   const y = yToPx(f.cash);

    //   const emphasize = hoverIndex === i;

    //   // ctx.fillStyle = 'rgba(54, 100, 220, 1)';

    //   ctx.fillStyle = 'transparent';

    //   ctx.lineWidth = 2;

    //   ctx.strokeStyle = '#007FFF';

    //   ctx.stroke();

    //   ctx.tension = 0.2;

    //   // ctx.pointRadius = 7;

    //   ctx.beginPath();

    //   ctx.arc(x, y, emphasize ? 7 : 4, 0, Math.PI * 2);

    //   ctx.fill();

    //   if (emphasize) {

    //     ctx.strokeStyle = '#fff';

    //     ctx.lineWidth = 1.5;

    //     ctx.stroke();

    //   }

    // });

   

    // legend

    const legendItems = [

      { label: 'Поступления', color: chart_colors.ar },

      { label: 'Расходы', color: chart_colors.ap },

      { label: 'Остаток', color: chart_colors.cash }

    ];

    let lx = padding.left;

    const ly = 5;

    ctx.font = '12px arial';

    legendItems.forEach(item => {

      ctx.fillStyle = item.color;

      ctx.fillRect(lx, ly, 10, 10);

      ctx.fillStyle = '#333';

      ctx.textAlign = 'left';

      ctx.textBaseline = 'top';

      ctx.fillText(item.label, lx + 14, ly - 1);

      lx += ctx.measureText(item.label).width + 34;

    });

    }

   

  // ---- hover tooltip ----

  function attachHoverInteraction(canvasId) {

      const canvas = document.getElementById(canvasId);

      if (canvas._hoverBound) return; // avoid stacking listeners on re-render

      canvas._hoverBound = true;

     

      const tooltip = getOrCreateTooltip(canvasId);

     

      canvas.addEventListener('mousemove', (e) => {

          const layout = cashGapChartState.layout;

          if (!layout) return;

         

          const rect = canvas.getBoundingClientRect();

          const scaleX = canvas.width / rect.width;

          const mouseX = (e.clientX - rect.left) * scaleX;

         

          const { padding, groupW, n } = layout;

          if (mouseX < padding.left || mouseX > padding.left + groupW * n) {

          hideTooltip(tooltip);

          setHoverIndex(null);

          return;

          }

         

          let idx = Math.floor((mouseX - padding.left) / groupW);

          idx = Math.max(0, Math.min(n - 1, idx));

          setHoverIndex(idx);

 

          const f = cashGapChartState.forecast[idx];

 

          const swatch = (chart_colors) =>

            `<span style="display:inline-block;width:9px;height:9px;background:${chart_colors};border-radius:2px;margin-right:5px;"></span>`;

         

          negativeText=f.cash<0 ? "red":"white"

 

          tooltip.innerHTML = `

            <strong>${f.week}</strong><br>

            ${swatch(chart_colors.ar)}поступления: ₽ ${Math.round(f.ar).toLocaleString()}<br>

            ${swatch(chart_colors.ap)}платежи: ₽ ${Math.round(f.ap).toLocaleString()}<br>

            ${swatch(chart_colors.cash)}остаток: ₽ ${Math.round(f.cash).toLocaleString()}<br>

            ЧДП: ₽ ${Math.round(f.net).toLocaleString()}

          `;

          tooltip.style.left = e.clientX + 12 + 'px';

          tooltip.style.top = e.clientY + 12 + 'px';

          tooltip.style.background = '#3E5F8A';

          tooltip.style.display = 'block';

          //// тест изменения цвета шрифта - скорректировать или удалить

          tooltip.setAttribute("class", "negative-text");

          tooltip.style.setProperty("--negative-text", negativeText);

          ///// окончание вставки

         

      });

     

      canvas.addEventListener('mouseleave', () => {

      hideTooltip(tooltip);

      setHoverIndex(null);

      });

  }

   

  function setHoverIndex(idx) {

    if (cashGapChartState.hoverIndex === idx) return;

    cashGapChartState.hoverIndex = idx;

    drawChart();

  }

   

  function getOrCreateTooltip(canvasId) {

    const id = `${canvasId}-tooltip`;

    let el = document.getElementById(id);

    if (!el) {

        el = document.createElement('div');

        el.id = id;

        Object.assign(el.style, {

            position: 'fixed',

            pointerEvents: 'none',

            background: 'rgba(0,0,0,0.85)',

            color: '#fff',

            padding: '6px 10px',

            borderRadius: '4px',

            fontSize: '12px',

            fontFamily: 'arial',

            lineHeight: '1.4',

            zIndex: '1000',

            display: 'none'

        });

        document.body.appendChild(el);

    }

    return el;

  }

   

  function hideTooltip(el) {

  el.style.display = 'none';

  }

   

  // ---- filters: opening / scenario / horizon ----

  function refreshChart() {

    const { forecast } = calculateForecast();

    render_cash_gap_chart(forecast);

  }

   

  ['opening', 'scenario', 'horizon'].forEach(id => {

    const el = document.getElementById(id);

    if (!el) return;

    const evt = el.tagName === 'SELECT' ? 'change' : 'input';

    el.addEventListener(evt, refreshChart);

  });

   

  // initial render

  refreshChart();

   

     

  // ---------------------------------------------------------

  // WEEKLY TABLE

  // ---------------------------------------------------------

  function renderTable(forecast) {

    $("rows").innerHTML =  forecast.map(row => `
    <tr class="week ${row.index === selectedWeekIndex ? "selected" : ""}"
    data-index="${row.index}">
      <td> ${row.week} </td>
      <td> ${RUB(row.ar)} </td>
      <td> ${RUB(row.ap)} </td>
      <td> ${RUB(row.net)} </td>
      <td class="${row.cash < 0 ? "danger" : "" }" >
      ${RUB(row.cash)} </td>
      <td class="${row.cash < 0 ? "danger" : "good" }" >
      ${row.cash < 0 ? "Разрыв" : "Остаток" } </td>

    </tr>

    `

    )

    .join("");

    document.querySelectorAll("tr.week")

      .forEach( row => { row.addEventListener( "click",

          () => {

              selectedWeekIndex = Number(row.dataset.index);

              renderDetail(forecast[selectedWeekIndex]);

              highlightRows();

              }

          );

        }

      );

  }

  // ---------------------------------------------------------

  // HIGHLIGHT SELECTED WEEK

  // ---------------------------------------------------------

  function highlightRows() {document.querySelectorAll("tr.week")

    .forEach(

      row => {row.classList.toggle("selected", Number(

            row.dataset.index) === selectedWeekIndex

          );

      }

    );

  }

  // ---------------------------------------------------------

  // DRIVER BARS

  // ---------------------------------------------------------

  function renderDrivers(items, factor, type) {

      const values =

      items.map( item => ({name: item[0], amount: item[1] * factor }));

      const max = Math.max(...values.map(x => x.amount), 1);

    return values

    .map(

      item => `

      <div class="driver">

        <div class="name">

          ${item.name}

        </div>

      <div class="bar">

        <div class="fill" style="width:${(item.amount / max) * 100}%;

        background:${type === "ar" ? chart_colors.ar : chart_colors.ap };

        " ></div>

      </div>

        <div class="amt">

          ${RUB(item.amount)}

        </div>

      </div>

      `

      )

    .join("");

  }

  // ---------------------------------------------------------

  // SELECTED WEEK DETAILS

  // ---------------------------------------------------------

  function renderDetail(row) {

    if (!row) {return; }

    const {scenario} = getSettings();

    const factors = SCENARIO_FACTORS[scenario];

    const source = DATA.raw[row.index];

    $("detailTitle").textContent =

    `${row.week} — ` +

    `${RUB(row.openingCash)} ` +

    `остаток на начало → ` +

    `${RUB(row.cash)} ` +

    `остаток на конец`;

    $("arDrivers").innerHTML =

      renderDrivers(

      source.ar,

      factors.ar,

      "ar"

      );

    $("apDrivers").innerHTML =

      renderDrivers(

      source.ap,

      factors.ap,

      "ap"

      );

    const gapSurplus =  row.cash < 0 ? RUB(row.cash): `${RUB(row.cash)} остаток`;

    $("summary").innerHTML = [["Остаток на начало", RUB(row.openingCash)],

    ["Чистый денежный поток", RUB(row.net)],

    ["Остаток на конец", RUB(row.cash)],

    ["Кассовый остаток/разрыв", gapSurplus]]

    .map(

      ([label, value]) => `

      <div class="sum">

        <span>

          ${label}

        </span>

        <b class="${label ==="Gap / surplus" && row.cash < 0 ? "danger" : "" }" >

          ${value}

        </b>

      </div>

      `

    )

    .join("");

  }

  // ---------------------------------------------------------

  // FULL RENDER

  // ---------------------------------------------------------

  function render() {

    const {forecast, opening} = calculateForecast();

    if (selectedWeekIndex >= forecast.length) {selectedWeekIndex = forecast.length - 1; }

      renderKpis(forecast, opening );

      render_cash_gap_chart(forecast);

      // renderChart(forecast);

      // // initial render

      // refreshChart();

      renderTable(forecast);

      renderDetail(forecast[selectedWeekIndex]);

  }

  // ---------------------------------------------------------

  // INITIALISE

  // ---------------------------------------------------------

  function initialise() {

      ["scenario", "opening", "horizon" ]

      .forEach(id => {

        $(id).addEventListener(

        "input", () => {selectedWeekIndex = 0; render(); }
          );
        }
      );
    render();
  }

  // ---------------------------------------------------------
  // START APPLICATION
  // ---------------------------------------------------------
  document.addEventListener(
  "DOMContentLoaded",
  initialise
  );