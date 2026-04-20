import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SmartEntryForm } from "@/components/smart-entry-form";

export default function AddEntryPage() {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Link href="/" className="text-foreground">
              New transaction
            </Link>
          </DialogTitle>
        </DialogHeader>
        <SmartEntryForm />
      </DialogContent>
    </Dialog>
  );
}
