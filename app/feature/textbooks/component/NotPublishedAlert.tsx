import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router";

export type NotPublishedAlertProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultUrl: string
};

export function NotPublishedAlert({ open, onOpenChange, defaultUrl }: NotPublishedAlertProps) {
    const navigate = useNavigate()

    const goToDefaultUnit = () => {
        onOpenChange(false)
        navigate(defaultUrl)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>🚫 강의 준비 중 🚫</AlertDialogTitle>
                    <AlertDialogDescription className="hidden"></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={goToDefaultUnit} >
                        기본 페이지 이동
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default NotPublishedAlert;
