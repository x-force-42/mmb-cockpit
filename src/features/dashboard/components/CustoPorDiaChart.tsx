import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatUSD } from "@/lib/format";
import type { DiaCusto } from "@/types/api";

interface Props {
  data: DiaCusto[];
}

export function CustoPorDiaChart({ data }: Props) {
  const sorted = [...data].sort((a, b) => a.dia.localeCompare(b.dia));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Custo por dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                tickFormatter={(v) => formatUSD(Number(v))}
                fontSize={11}
                width={80}
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <Tooltip
                labelFormatter={(label) => formatDate(String(label))}
                formatter={(value) => [formatUSD(Number(value)), "Custo"]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="usd"
                stroke="hsl(160 84% 39%)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
