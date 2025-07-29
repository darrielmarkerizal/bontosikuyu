import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-red-600">{error}</p>
            <Button onClick={onRetry}>Coba Lagi</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
