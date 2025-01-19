'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { createNote } from '@/utils/supabase/queries';
import { useState } from 'react';

interface RequestGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestGameDialog({
  open,
  onOpenChange
}: RequestGameDialogProps) {
  const [gameName, setGameName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async () => {
    console.log('Submitting game request...');
    if (!gameName.trim()) return;

    setIsSubmitting(true);
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const response = await createNote(supabase, {
        user_id: user?.id ?? '',
        content: `${gameName}`,
        type: 'GAME_REQUEST'
      });
      console.log(response);

      setGameName('');
      onOpenChange(false);

      toast({
        description:
          "Thanks for your request! We'll review it and add support for this game soon. For real, check back tomorrow.",
        duration: 3000,
        className: 'bg-zinc-900 border-zinc-800 text-white'
      });
    } catch (error) {
      console.error('Error submitting game request:', error);
      toast({
        description: 'Failed to submit request. Please try again.',
        duration: 3000,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Request a Game</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Which game would you like Quest Raven to support next?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter the name of the game you'd like us to add..."
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="bg-zinc-950 border-zinc-800 text-white"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-zinc-400 hover:text-white"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={!gameName.trim() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
