import { el } from 'redom';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

/**
 * Вычисляет высоту графика на основе медианы и максимального значения.
 */
export const calculationTop = (median, max) => {
  const heightMedianRaw = 84 - (median / max) * 84 + 2;
  if (heightMedianRaw > 74) {
    return 74;
  } else if (heightMedianRaw < 14) {
    return 14;
  } else {
    return heightMedianRaw;
  }
};

export const checkValidateSum = (valueSum, balance, styleText = '') => {
  let transferError = document.getElementById('textErrorSum');
  if (transferError) transferError.remove();

  let errorText = createErrorText(valueSum, balance);

  if (errorText) {
    const blockInput = document.getElementById('blockSum');
    transferError = el(
      `p.form__error.error-text${styleText}`,
      { id: 'textErrorSum' },
      errorText,
    );
    blockInput.append(transferError);
    return false;
  }
  return true;
};

export const chartDiagram = (canvasName, ctx, data, max, min) => {
  const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.setLineDash(options.borderDash || []);
      ctx.lineDashOffset = options.borderDashOffset;
      ctx.strokeRect(left + 1, top + 1, width - 3, height - 2);
      ctx.restore();
    },
  };

  new Chart(ctx, {
    type: 'bar',
    plugins: [chartAreaBorder],
    data: {
      labels: data.labels,
      datasets: getDatasets(data, canvasName),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        chartAreaBorder: {
          borderColor: 'black',
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          offset: true,
          barPercentage: 0.1, // Уменьшите это значение для увеличения расстояния между столбцами
          categoryPercentage: 0.1, // Уменьшите это значение для увеличения расстояния между группами столбцов
          stacked: true,
          ticks: {
            padding: 2,
            color: '#000',
            font: {
              size: 20,
              weight: 700,
              family: "'Work Sans', sans-serif",
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          stacked: true,
          display: false,
          grid: {
            display: false,
          },
          max: max,
          min: min,
        },
      },
    },
  });
};

/**
 * Получает наборы данных для построения графиков на основе данных о балансе.
 */
const getDatasets = (dataBalance, canvasName) => {
  if (canvasName !== 'detail-arrival') {
    return [
      {
        label: 'Баланс',
        data: dataBalance.data,
        backgroundColor: '#116acc',
        hoverBackgroundColor: '#0f539e',
        maxBarThickness: 50,
        borderWidth: 1,
      },
    ];
  } else {
    return [
      {
        label: 'Расход',
        data: dataBalance.expenditure,
        borderWidth: 1,
        backgroundColor: '#fd4e5d',
        hoverBackgroundColor: '#c53d49',
        maxBarThickness: 50,
      },
      {
        label: 'Приход',
        data: dataBalance.arrival,
        borderWidth: 1,
        backgroundColor: '#76ca66',
        hoverBackgroundColor: '#60a354',
        maxBarThickness: 50,
      },
    ];
  }
};

/**
 * Возвращает массив предустановленных номеров счетов для использования в качестве примера.
 */
export const arrRecipAccounts = () => {
  return [
    '61253747452820828268825011',
    '05168707632801844723808510',
    '17307867273606026235887604',
    '27120208050464008002528428',
    '2222400070000005',
    '5555341244441115',
  ];
};
