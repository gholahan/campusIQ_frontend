import { Loader2 } from "lucide-react";

const Authloader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="h-15 w-15 animate-spin text-blue-600" />
    </div>
  );
};

export default Authloader;