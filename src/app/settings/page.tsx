"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-card via-background to-card/80">
           <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <SettingsIcon className="w-6 h-6" /> Configurações
              </CardTitle>
              <CardDescription>Gerencie as preferências do aplicativo.</CardDescription>
           </CardHeader>
           <CardContent>
               <p className="text-muted-foreground">Ajuste o aplicativo de acordo com suas necessidades.</p>
           </CardContent>
       </Card>

      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">As opções de configuração aparecerão aqui em breve.</p>
          {/* Future settings components will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
