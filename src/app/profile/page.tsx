
"use client"; // Add "use client" for hooks and event handlers

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, LogOut } from "lucide-react"; // Import LogOut icon
import { useAuth } from "@/hooks/useAuth"; // Import useAuth hook
import { useRouter } from "next/navigation"; // Import useRouter for potential redirection if needed
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function ProfilePage() {
  const { user, logout } = useAuth(); // Get user and logout function
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    logout(); // Call the logout function
    toast({
      title: "Logout Realizado",
      description: "Você foi desconectado com sucesso.",
      variant: "destructive",
    });
    // AuthGuard will automatically handle redirecting to login UI
    // No explicit router.push('/login') needed here as AuthGuard handles it.
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Perfil e Relatórios</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.photoURL || "/placeholder-user.png"} alt="Avatar do Usuário" data-ai-hint="person silhouette"/>
            <AvatarFallback>{user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user?.displayName || "Usuário"}</CardTitle>
            <CardDescription>Entrou em Julho 2024 (Simulado)</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Este é o seu espaço pessoal. Gerencie suas configurações e veja relatórios de progresso.</p>
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

      {/* Logout Button */}
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Sessão</CardTitle>
            <CardDescription>Gerenciar sua sessão atual.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
