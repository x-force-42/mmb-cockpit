import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RunsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Runs</CardTitle>
        <CardDescription>
          Lista de runs — em construção (F3 entrega filtros e paginação).
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Esboço de tela. Esperando a camada de dados (F1) e telas reais.
      </CardContent>
    </Card>
  );
}
