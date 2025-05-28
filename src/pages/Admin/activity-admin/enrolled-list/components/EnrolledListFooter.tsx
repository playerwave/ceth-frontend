import Button from "../../../../../components/Button";

export default function EnrolledListFooter() {
  return (
    <div className="mt-auto flex justify-left p-4 ">
      <Button  onClick={() => window.history.back()}>
        ← กลับ
      </Button>
    </div>
  );
}
