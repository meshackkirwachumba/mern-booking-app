import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onclose: () => void;
};

const Toast = ({ message, type, onclose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onclose();
    }, 5000);

    // clear timer ie when component unmount
    return () => clearTimeout(timer);
  }, [onclose]);

  const styles =
    type === "SUCCESS"
      ? "fixed top-4 right-4 p-4 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-4 right-4 p-4 rounded-md bg-red-600 text-white max-w-md";
  return (
    <div className={styles}>
      <div className="flex items-center justify-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
