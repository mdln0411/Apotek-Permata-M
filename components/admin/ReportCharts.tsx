import type { ReportChartData } from '@/api/reportService';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

type ChartComponent = React.ComponentType<Record<string, unknown>>;

let LineChart: ChartComponent | undefined;
let BarChart: ChartComponent | undefined;
let PieChart: ChartComponent | undefined;

try {
  const chartKit = require('react-native-chart-kit') as {
    LineChart?: ChartComponent;
    BarChart?: ChartComponent;
    PieChart?: ChartComponent;
  };
  LineChart = chartKit.LineChart;
  BarChart = chartKit.BarChart;
  PieChart = chartKit.PieChart;
} catch {
  // Chart library unavailable — fall back to empty states below.
}

const chartsReady = !!(LineChart && BarChart && PieChart);

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 72;

/** Lebar chart agar label tidak bertumpuk; bisa di-scroll horizontal di ChartCard. */
function scrollableChartWidth(labelCount: number, pxPerLabel: number): number {
  return Math.max(CHART_WIDTH, labelCount * pxPerLabel);
}

function barChartScrollWidth(labels: string[]): number {
  const longest = labels.reduce((max, l) => Math.max(max, l.length), 0);
  const pxPerLabel = Math.max(72, longest * 8);
  return scrollableChartWidth(labels.length, pxPerLabel);
}

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(46, 139, 87, ${opacity})`,
  labelColor: () => '#7A8A7A',
  propsForBackgroundLines: { stroke: '#F0F4F0', strokeWidth: 1 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#2E8B57' },
  fillShadowGradientFrom: '#2E8B57',
  fillShadowGradientTo: '#A5D6A7',
  fillShadowGradientFromOpacity: 0.4,
  fillShadowGradientToOpacity: 0.05,
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

type Props = {
  revenueLine: ReportChartData;
  bestSellersBar: ReportChartData;
  orderStatusPie: ReportChartData;
  weeklyArea: ReportChartData;
  monthlyRevenue: ReportChartData;
};

export default function ReportCharts({
  revenueLine,
  bestSellersBar,
  orderStatusPie,
  weeklyArea,
  monthlyRevenue,
}: Props) {
  const hasRevenue = revenueLine.data.some((v) => v > 0);
  const hasBest = bestSellersBar.data.length > 0;
  const hasPie = orderStatusPie.data.some((v) => v > 0);
  const hasWeekly = weeklyArea.data.some((v) => v > 0);
  const hasMonthly = monthlyRevenue.data.some((v) => v > 0);

  const pieData = orderStatusPie.labels.map((label, i) => ({
    name: label,
    population: orderStatusPie.data[i] ?? 0,
    color: orderStatusPie.colors?.[i] ?? '#2E8B57',
    legendFontColor: '#555',
    legendFontSize: 11,
  }));

  return (
    <View style={styles.wrap}>
      <ChartCard title="Grafik Pendapatan Harian" subtitle="Line chart — tren pendapatan per hari">
        {!chartsReady || !LineChart ? (
          <EmptyChart message="Grafik tidak tersedia" />
        ) : hasRevenue ? (
          <LineChart
            data={{ labels: revenueLine.labels, datasets: [{ data: revenueLine.data.length ? revenueLine.data : [0] }] }}
            width={scrollableChartWidth(revenueLine.labels.length, 48)}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines
            withOuterLines={false}
            fromZero
          />
        ) : (
          <EmptyChart message="Belum ada data pendapatan" />
        )}
      </ChartCard>

      <ChartCard title="Pendapatan Bulanan" subtitle="Line chart — 6 bulan terakhir">
        {!chartsReady || !LineChart ? (
          <EmptyChart message="Grafik tidak tersedia" />
        ) : hasMonthly ? (
          <LineChart
            data={{ labels: monthlyRevenue.labels, datasets: [{ data: monthlyRevenue.data }] }}
            width={scrollableChartWidth(monthlyRevenue.labels.length, 88)}
            height={200}
            chartConfig={{ ...chartConfig, color: (o = 1) => `rgba(25, 118, 210, ${o})` }}
            bezier
            style={styles.chart}
            withInnerLines
            fromZero
          />
        ) : (
          <EmptyChart message="Belum ada data bulanan" />
        )}
      </ChartCard>

      <ChartCard title="Produk Paling Laku" subtitle="Bar chart — jumlah unit terjual">
        {!chartsReady || !BarChart ? (
          <EmptyChart message="Grafik tidak tersedia" />
        ) : hasBest ? (
          <BarChart
            data={{ labels: bestSellersBar.labels, datasets: [{ data: bestSellersBar.data }] }}
            width={barChartScrollWidth(bestSellersBar.labels)}
            height={200}
            chartConfig={{ ...chartConfig, color: (o = 1) => `rgba(46, 139, 87, ${o})` }}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
            yAxisLabel=""
            yAxisSuffix=""
          />
        ) : (
          <EmptyChart message="Belum ada produk terjual" />
        )}
      </ChartCard>

      <ChartCard title="Status Pesanan" subtitle="Pie chart — distribusi status">
        {!chartsReady || !PieChart ? (
          <EmptyChart message="Grafik tidak tersedia" />
        ) : hasPie ? (
          <PieChart
            data={pieData}
            width={CHART_WIDTH}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="12"
            style={styles.chart}
          />
        ) : (
          <EmptyChart message="Belum ada data pesanan" />
        )}
      </ChartCard>

      <ChartCard title="Transaksi per Minggu" subtitle="Area chart — jumlah transaksi 7 hari">
        {!chartsReady || !LineChart ? (
          <EmptyChart message="Grafik tidak tersedia" />
        ) : hasWeekly ? (
          <LineChart
            data={{ labels: weeklyArea.labels, datasets: [{ data: weeklyArea.data }] }}
            width={CHART_WIDTH}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withShadow
            withInnerLines
            fromZero
          />
        ) : (
          <EmptyChart message="Belum ada transaksi minggu ini" />
        )}
      </ChartCard>
    </View>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2EE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 15, fontWeight: '700', color: '#1A2E1A' },
  subtitle: { fontSize: 12, color: '#7A8A7A', marginTop: 2, marginBottom: 12 },
  chart: { borderRadius: 12, marginTop: 4 },
  empty: { height: 160, justifyContent: 'center', alignItems: 'center', width: CHART_WIDTH },
  emptyText: { color: '#9AA89A', fontSize: 13 },
});
