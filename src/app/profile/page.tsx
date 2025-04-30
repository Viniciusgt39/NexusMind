import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download, Timer, AlarmClock, StickyNote, Settings } from "lucide-react";
import AdhdTimer from "@/components/features/AdhdTimer"; // Reuse timer here or link to it

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Profile & Reports</h1>
         <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
            <span className="sr-only">Settings</span>
         </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder-user.png" alt="User Avatar" data-ai-hint="person silhouette"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Alex Johnson</CardTitle>
            <CardDescription>Joined July 2024</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This is your personal space. Manage your settings and view progress reports.</p>
           {/* Add more profile details or settings toggles here if needed */}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Weekly Reports</CardTitle>
          <CardDescription>Summaries generated for your clinical follow-up (simulated).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Week Ending 2024-07-21</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
           <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Week Ending 2024-07-14</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
           <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Week Ending 2024-07-07</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

       <Card className="shadow-md">
          <CardHeader>
             <CardTitle>ADHD Support Tools</CardTitle>
             <CardDescription>Quick access to tools for focus and organization.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {/* ADHD Timer Component - Reused or linked */}
             <div className="col-span-1 sm:col-span-3">
                <AdhdTimer />
             </div>

              {/* Placeholder for Alarm */}
              <Button variant="outline" className="w-full justify-start gap-2">
                 <AlarmClock className="w-5 h-5 text-primary" />
                 <span>Set Alarm</span>
              </Button>

              {/* Placeholder for Notepad */}
              <Button variant="outline" className="w-full justify-start gap-2">
                 <StickyNote className="w-5 h-5 text-primary" />
                 <span>Quick Notes</span>
              </Button>

               <p className="text-xs text-muted-foreground mt-2 text-center col-span-1 sm:col-span-3">(Alarm & Notepad features are simulated/placeholders)</p>
          </CardContent>
       </Card>
    </div>
  );
}
