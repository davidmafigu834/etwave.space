import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Info } from 'lucide-react';

interface SystemInfoProps {
  currentVersion: string;
  lastUpdate?: string;
  updateCount: number;
}

export default function SystemInfo({ currentVersion, lastUpdate, updateCount }: SystemInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          System Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              v{currentVersion}
            </div>
            <div className="text-sm text-muted-foreground">
              Current Version
            </div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {updateCount}
            </div>
            <div className="text-sm text-muted-foreground">
              Updates Applied
            </div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Up to Date</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {lastUpdate ? `Updated ${lastUpdate}` : 'No updates yet'}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            System is automatically updated through the admin panel.
            All updates include automatic backups and rollback capabilities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
