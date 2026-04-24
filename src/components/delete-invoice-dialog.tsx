import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInvoiceStore } from "@/store/invoice-store";
import { useUIStore } from "@/store/ui-store";

export function DeleteInvoiceDialog() {
    const deleteTargetId = useUIStore((state) => state.deleteTargetId);
    const cancelDelete = useUIStore((state) => state.cancelDelete);
    const goBackToList = useUIStore((state) => state.goBackToList);
    const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);

    const open = deleteTargetId !== null;

    const handleConfirm = () => {
        if (deleteTargetId) {
            deleteInvoice(deleteTargetId);
            goBackToList();
        }
        cancelDelete();
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (!next) cancelDelete();
            }}
        >
            <AlertDialogContent className="bg-03 p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete invoice{" "}
                        <span className="font-semibold text-foreground">
                            #{deleteTargetId}
                        </span>
                        ? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="border-none bg-03">
                    <AlertDialogCancel className="border-none bg-04">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleConfirm}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
