import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Hello() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello cockpit</CardTitle>
        <CardDescription>
          Dashboard em construção — agregados de governança vêm em F5.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Use a navegação à esquerda pra explorar.
      </CardContent>
    </Card>
  );
}
