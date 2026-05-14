import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { DailyRuns } from "@/types/api";

interface Props {
  data: DailyRuns[];
}

export function RunsPorDiaChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.dia.localeCompare(b.dia));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Runs por dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="dia"
                tickFormatter={formatDate}
                fontSize={11}
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                fontSize={11}
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <Tooltip
                labelFormatter={(label) => formatDate(String(label))}
                formatter={(value) => [Number(value), "Runs"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="n" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
