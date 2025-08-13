import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import EmployeeLoginPage from "./employee/login/page";

export default function Home() {
  return (
    <div>
      <EmployeeLoginPage />
    </div>
  );
}
