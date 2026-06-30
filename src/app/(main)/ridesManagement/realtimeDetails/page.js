import { Suspense } from "react";
import RealTimeDetailsPage from "./RealTimeDetailsPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RealTimeDetailsPage />
    </Suspense>
  );
}
