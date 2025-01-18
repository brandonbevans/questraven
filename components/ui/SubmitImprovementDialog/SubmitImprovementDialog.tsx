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
import { createNote, getUser } from '@/utils/supabase/queries';
import { useState } from 'react';

interface SubmitImprovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubmitImprovementDialog({
  open,
  onOpenChange
}: SubmitImprovementDialogProps) {
  const [improvement, setImprovement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!improvement.trim()) return;

    setIsSubmitting(true);
    try {
      const user = await getUser(supabase);
      console.log('Creating note...');
      const response = await createNote(supabase, {
        user_id: user.id,
        content: `${improvement}`,
        type: 'FEEDBACK'
      });

      // Clear input and close dialog
      setImprovement('');
      onOpenChange(false);

      // Show success toast
      toast({
        description:
          'Thank you for your feedback! We appreciate your help in improving Quest Raven.',
        duration: 3000,
        className: 'bg-zinc-900 border-zinc-800 text-white'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        description: 'Failed to submit feedback. Please try again.',
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
          <DialogTitle className="text-white">Submit Improvement</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Describe your suggestion for improving Quest Raven. We appreciate
            your feedback!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Type your improvement suggestion here..."
            value={improvement}
            onChange={(e) => setImprovement(e.target.value)}
            className="bg-zinc-950 border-zinc-800 text-white"
            rows={5}
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
            disabled={!improvement.trim() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
