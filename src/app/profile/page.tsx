import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download } from "lucide-react"; // Removed Settings icon
// Removed AdhdTimer import as the section is moved

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Perfil e Relatórios</h1>
         {/* Settings button removed */}
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder-user.png" alt="Avatar do Usuário" data-ai-hint="person silhouette"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Alex Johnson</CardTitle>
            <CardDescription>Entrou em Julho 2024</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Este é o seu espaço pessoal. Gerencie suas configurações e veja relatórios de progresso.</p>
           {/* Adicione mais detalhes do perfil ou opções de configurações aqui, se necessário */}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Relatórios Semanais</CardTitle>
          <CardDescription>Resumos gerados para seu acompanhamento clínico (simulado).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Semana Terminando em 21/07/2024</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Baixar
            </Button>
          </div>
           <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Semana Terminando em 14/07/2024</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Baixar
            </Button>
          </div>
           <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Semana Terminando em 07/07/2024</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Baixar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ADHD Support Tools section removed from here */}
    </div>
  );
}
