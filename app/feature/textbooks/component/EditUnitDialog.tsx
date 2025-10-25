import React from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { UnitInfoType } from "../layout/textbook-layout";

export type EditUnitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitInfo: UnitInfoType | null;
  setUnitInfo: React.Dispatch<React.SetStateAction<UnitInfoType | null>>;
  onSave: () => void;
};

export function EditUnitDialog({ open, onOpenChange, unitInfo, setUnitInfo, onSave }: EditUnitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>수정</DialogTitle>
          <DialogDescription>.</DialogDescription>
        </DialogHeader>
        <div className={"grid grid-cols-5"}>
          <Input
            className={"col-span-1"}
            value={unitInfo?.major.sort_order ?? ""}
            type="number"
            required
            onChange={(e) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.major.sort_order = Number(e.target.value);
              return next;
            })}
          />
          <Input
            className={"col-span-4"}
            value={unitInfo?.major.title ?? ""}
            required
            onChange={(e) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.major.title = e.target.value;
              return next;
            })}
          />
        </div>
        <div className={"grid grid-cols-5"}>
          <Input
            className={"col-span-1"}
            value={unitInfo?.middle.sort_order ?? ""}
            type="number"
            required
            onChange={(e) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.middle.sort_order = Number(e.target.value);
              return next;
            })}
          />
          <Input
            className={"col-span-4"}
            value={unitInfo?.middle.title ?? ""}
            required
            onChange={(e) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.middle.title = e.target.value;
              return next;
            })}
          />
        </div>
        <div className={"grid grid-cols-5"}>
          <Input
            className={"col-span-1"}
            value={unitInfo?.unit.sort_order ?? ""}
            type="number"
            required
            onChange={(e) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.unit.sort_order = Number(e.target.value);
              return next;
            })}
          />
          <Input
            className={"col-span-4"}
            value={unitInfo?.unit.title ?? ""}
            required
            onChange={(e) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.unit.title = e.target.value;
              return next;
            })}
          />
        </div>
        <div className={"flex justify-evenly"}>
          isFree
          <Switch
            checked={!!unitInfo?.is_free}
            onCheckedChange={(checked) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.is_free = checked;
              return next;
            })}
          />
          isPub
          <Switch
            checked={!!unitInfo?.is_published}
            onCheckedChange={(checked) => setUnitInfo((prv) => {
              const next = { ...(prv as UnitInfoType) } as UnitInfoType;
              if (next) next.is_published = checked;
              return next;
            })}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button onClick={onSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditUnitDialog;
